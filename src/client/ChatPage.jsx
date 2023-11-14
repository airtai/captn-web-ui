// import { User } from '@wasp/entities';
import { useQuery } from '@wasp/queries'
import getChats from '@wasp/queries/getChats'
import getConversations from '@wasp/queries/getConversations'
import logout from '@wasp/auth/logout';
import { useState, useEffect, useRef } from 'react';
// import { Chat, Conversation } from '@wasp/entities'
import { Link } from '@wasp/router'
import Markdown from 'react-markdown'

import logo from './static/rba-logo.png'
import createChat from '@wasp/actions/createChat'
import updateConversation from '@wasp/actions/updateConversation'
import getAgentResponse from '@wasp/actions/getAgentResponse'
import { useHistory } from 'react-router-dom';

const ChatsList = ({ chats }) => {
    if (!chats?.length) return <p></p>
    return (
      <div>
        {chats.map((chat, idx) => (
            <Link
            key={chat.id}
            to="/chat/:id?"
            params={{ id: chat.id }}>
                <li key={idx}>
                    <div className="flex items-center p-2 text-white hover:bg-rba-light-gray hover:text-rba-dark-gray group rounded-lg ">
                    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="icon-sm" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    <span className="ml-3">
                        {chat.id}
                    </span>
                    </div>
                </li>
            </Link>
        ))}
      </div>
    )
  }

const Loader = () => {
    return (
        <div className="absolute top-[38%] left-[45%] -translate-y-2/4 -translate-x-2/4">
            <div className="w-12 h-12 border-4 border-white rounded-full animate-spin border-t-rba-yellow border-t-4"></div>
        </div>
    )
}

const ConversationsList = ({ conversations }) => {
    if (!conversations?.length) return <div>No conversations</div>

    return (
        <div className="w-full">
          {conversations.map((conversation, idx) => {
            const conversationBgColor = conversation.role === "user" ? "rba-dark-gray" : "rba-light-gray";
            const conversationTextColor = conversation.role === "user" ? "white" : "black";
            const conversationLogo = conversation.role === "user" ? <div style={{"alignItems": "center","background": "#fff","borderRadius": "50%","color": "#444654","display": "flex","flexBasis": "40px","flexGrow": "0","flexShrink": "0","fontSize": "14px","height": "40px","justifyContent": "center","padding": "5px","position": "relative","width": "40px"}} className="flex"><div>You</div></div>: <img alt="captn logo" src={logo} className="w-full h-full" style={{"borderRadius": "50%"}} />
            return (
            <div key={idx}>
                <div style={{"minHeight": "85px"}} className={`flex items-center px-5 py-2 group bg-${conversationBgColor}`}>
                    
                <div style={{"maxWidth": "840px", "margin": "auto"}} className={`relative ml-3 block w-full p-4 pl-10 text-sm text-${conversationTextColor}  border-${conversationBgColor} rounded-lg bg-${conversationBgColor} `}>
                    <span className="absolute inline-block" style={{"left": "-15px", "top": "6px", "height":" 45px", "width": "45px"}}>
                        {conversationLogo}
                    </span>
                    <div className="chat-conversations text-base flex flex-col gap-2">
                        <Markdown>{conversation.content}</Markdown>
                    </div>
                </div>
                </div>
            </div>
            );
        })}
        </div>
      )

}

// export default function ChatPage({ user }: { user: User }, props: RouteComponentProps<{ id: string }>) {
export default function ChatPage(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [chatConversations, setChatConversations] = useState([{}]);
    const [conversationId, setConversationId] = useState(null);
    const chatContainerRef = useRef(null);
    // const [chatId, setChatId] = useState(null);

    const { data: chats, isLoading: isLoadingChats } = useQuery(getChats)
    const { data: conversations, isLoading: isLoadingConversations } = useQuery(getConversations,
        {
            chatId: Number(props.match.params.id),
        }
    )
    // if(conversations) {
    //     setChatConversations(conversations.conversation)   
    // }
    // setChatId(props.match.params.id)
    // console.log(`chatId: ${chatId}`)

    useEffect(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, [conversations]);
    
    
    const history = useHistory();

    const chatContainerClass = `flex h-full flex-col items-center justify-between pb-24 overflow-y-auto bg-captn-light-blue ${isLoading ? 'opacity-40' : 'opacity-100'}`
    
    const handleClick = async (event) => {
        event.preventDefault()
        try {
            const newChatConversations = await createChat();
            setChatConversations(newChatConversations.conversation);
            setConversationId(newChatConversations.id);
            history.push(`/chat/${newChatConversations.chatId}`);
          } catch (err) {
            window.alert('Error: ' + err.message)
          }
        // console.log(event.target);
        // console.log(event.currentTarget);
      };

      const handleFormSubmit = async (event) => {
        event.preventDefault()
        try {
          const target = event.target
          const userQuery = target.userQuery.value
          target.reset()

          // 1. add new conversation to table
          const payload = {
              conversation_id: conversations.id,
              conversations: [...conversations.conversation, ...[{ "role": "user", "content": userQuery }]]
          }
          await updateConversation(payload)
          // 2. call backend python server to get agent response
          setIsLoading(true)
          const response = await getAgentResponse({
              message: userQuery,
              conv_id: payload.conversation_id,
            })
            setIsLoading(false)
          // 3. add agent response as new conversation in the table
          const openAIPayload = {
              conversation_id: conversations.id,
              conversations: [...payload.conversations, ...[{ "role": "assistant", "content": response.content }]]
          }
          await updateConversation(openAIPayload)
        } catch (err) {
          window.alert('Error: ' + err.message)
        }
    
      }

    return (
        <div className='relative z-0 flex h-full w-full overflow-hidden h-screen'>
            <div id="default-sidebar" className="md:w-[260px] flex-shrink-0 overflow-x-hidden dark bg-rba-dark-gray gizmo:bg-black" aria-label="Sidebar">
            <div style={{"borderRight": "1px solid #eae4d9"}} className="border-x-rba-dark-gray h-full px-3 py-4 overflow-y-auto bg-rba-dark-gray">
                <div className='mb-1 flex flex-row gap-2'>
                <button
                onClick={handleClick}
                className='flex px-3 min-h-[44px] py-1 items-center gap-3 transition-colors duration-200 cursor-pointer text-sm rounded-md rounded-md text-black bg-rba-yellow hover:bg-rba-yellow-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex-grow overflow-hidden hover:brightness-90'
                >
                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="icon-sm shrink-0" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                <span className="m-0 p-0 md:hidden">New</span>
                <span className="m-0 p-0 hidden md:inline-block">New chat</span>
                </button>
            </div>

                <div className="flex-col flex-1 transition-opacity duration-500 -mr-2 pr-2 overflow-y-auto">
                <ul className="py-5 space-y-2 font-medium">
                    {chats && <ChatsList chats={chats} />}
                </ul>
                </div>
            </div>
            </div>
            <div className="relative flex h-full max-w-full flex-1 flex-col overflow-hidden bg-rba-light-gray">
                <div className="relative h-full w-full flex-1 overflow-auto transition-width">
                    <div className="flex h-full flex-col">
                        <div className="flex-1 overflow-hidden">
                        <div ref={chatContainerRef} className={`${chatContainerClass}`} style={{"height": "85%"}}>
                            {conversations && <ConversationsList conversations={conversations.conversation} />}
                        </div>
                        {isLoading && <Loader />}
                        {props.match.params.id ? (<div className="w-full pt-0 md:pt-2 md:pt-0 border-t md:border-t-0 dark:border-white/20 md:border-transparent md:dark:border-transparent md:pl-2 gizmo:pl-0 gizmo:md:pl-0 md:w-[calc(100%-.5rem)] absolute bottom-100 left-0 md:bg-vert-light-gradient bg-white dark:bg-gray-800 md:!bg-transparent dark:md:bg-vert-dark-gradient">
                            <form onSubmit={handleFormSubmit} className="">    
                                <label htmlFor="search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        {/* <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                        </svg> */}
                                    </div>
                                    <input type="search" id="userQuery" name="search" className="block w-full p-4 pl-5 text-sm text-rba-light-gray border border-rba-dark-gray rounded-lg bg-rba-dark-gray focus:ring-blue-500 focus:border-blue-500" placeholder="Send a message" required />
                                    <button type="submit" className="text-black absolute right-2.5 bottom-2.5 bg-rba-yellow hover:bg-rba-yellow focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">Send</button>
                                </div>
                            </form>
                        </div>) : <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl md:text-6xl text-rba-dark-gray opacity-70" style={{"lineHeight": "normal"}}>Please initiate a new chat or select existing chats to resume your conversation.</p>}
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className='inline-flex w-full justify-end'>
                <button
                onClick={logout}
                className='inline-flex justify-center mx-8 py-2 px-4 border border-transparent shadow-md text-sm font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                >
                logout
                </button>
            </div> */}
        </div>
    )
}