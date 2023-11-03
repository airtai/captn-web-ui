import { User } from '@wasp/entities';
import { useQuery } from '@wasp/queries'
import getChats from '@wasp/queries/getChats'
import getConversations from '@wasp/queries/getConversations'
import logout from '@wasp/auth/logout';
import { useState, Dispatch, SetStateAction } from 'react';
import { Chat, Conversation } from '@wasp/entities'
import { Link } from '@wasp/router'


import createChat from '@wasp/actions/createChat'
import updateConversation from '@wasp/actions/updateConversation'
import generateOpenAIResponse from '@wasp/actions/generateOpenAIResponse'
import { RouteComponentProps, useHistory } from 'react-router-dom';

const ChatsList = ({ chats }: { chats: Chat[] }) => {
    if (!chats?.length) return <div>No chats</div>
    return (
      <div>
        {chats.map((chat, idx) => (
            <Link
            key={chat.id}
            to="/chat/:id"
            params={{ id: chat.id }}>
                <li key={idx}>
                    <div className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                    <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="icon-sm" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
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

const ConversationsList = ({ conversations }: { conversations: Conversation[] }) => {
    if (!conversations?.length) return <div>No conversations</div>
    return (
        <div>
          {conversations.map((conversation, idx) => (
            <div key={idx}>
                <div className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white group">
                <svg className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
                    <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z"/>
                    <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z"/>
                </svg>
                <span className="ml-3 block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white">
                    {conversation.content}
                </span>
                </div>
            </div>
          ))}
        </div>
      )

}

// export default function ChatPage({ user }: { user: User }, props: RouteComponentProps<{ id: string }>) {
export default function ChatPage(props: RouteComponentProps<{ id: string }>) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [chatConversations, setChatConversations] = useState([{}]);
    const [conversationId, setConversationId] = useState(null);
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
    
    
    const history = useHistory();
    
    const handleClick = async (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault()
        try {
            const newChatConversations = await createChat();
            setChatConversations(newChatConversations.conversation);
            setConversationId(newChatConversations.id);
            history.push(`/chat/${newChatConversations.chatId}`);
          } catch (err: any) {
            window.alert('Error: ' + err.message)
          }
        // console.log(event.target);
        // console.log(event.currentTarget);
      };

      const handleFormSubmit = async (event) => {
        event.preventDefault()
        console.log("conversationId")
        console.log(conversationId)
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
          // 2. call open api with the whole conversation
          const response = await generateOpenAIResponse({conversation: payload.conversations})
          // 3. add open ai response as new conversation to table
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
            <div id="default-sidebar" style={{width: '260px'}} className="flex-shrink-0 overflow-x-hidden dark bg-gray-900 gizmo:bg-black" aria-label="Sidebar">
            <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
                <div className='mb-1 flex flex-row gap-2'>
                <button
                onClick={handleClick}
                className='flex px-3 min-h-[44px] py-1 items-center gap-3 transition-colors duration-200 dark:text-white cursor-pointer text-sm rounded-md rounded-md text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex-grow overflow-hidden'
                >
                <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="icon-sm shrink-0" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                New chat
                </button>
            </div>

                <div className="flex-col flex-1 transition-opacity duration-500 -mr-2 pr-2 overflow-y-auto">
                <ul className="py-5 space-y-2 font-medium">
                    {chats && <ChatsList chats={chats} />}
                </ul>
                </div>
            </div>
            </div>
            <div className="relative flex h-full max-w-full flex-1 flex-col overflow-hidden">
                <div className="relative h-full w-full flex-1 overflow-auto transition-width">
                    <div className="flex h-full flex-col">
                        <div className="flex-1 overflow-hidden">
                        <div className="flex h-full flex-col items-center justify-between pb-24 overflow-y-auto" style={{"height": "80%"}}>
                            {conversations && <ConversationsList conversations={conversations.conversation} />}
                        </div>
                        <div className="w-full pt-2 md:pt-0 border-t md:border-t-0 dark:border-white/20 md:border-transparent md:dark:border-transparent md:pl-2 gizmo:pl-0 gizmo:md:pl-0 md:w-[calc(100%-.5rem)] absolute bottom-100 left-0 md:bg-vert-light-gradient bg-white dark:bg-gray-800 md:!bg-transparent dark:md:bg-vert-dark-gradient">
                            <form onSubmit={handleFormSubmit} className="">    
                                <label htmlFor="search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                        </svg>
                                    </div>
                                    <input type="search" id="userQuery" name="search" className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search" required />
                                    <button type="submit" className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Send</button>
                                </div>
                            </form>
                        </div>
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