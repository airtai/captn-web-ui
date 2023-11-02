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
                    <svg className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
                        <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z"/>
                        <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z"/>
                    </svg>
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
        <div className='mt-10 px-6'>
            <aside id="default-sidebar" className="fixed top-50 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
            <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
                <div className='inline-flex w-full justify-end'>
                <button
                onClick={handleClick}
                className='inline-flex justify-center mx-8 py-2 px-4 border border-transparent shadow-md text-sm font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                >
                New chat
                </button>
            </div>
                {/* <h3>Chats</h3> */}
                <ul className="space-y-2 font-medium">
                    {chats && <ChatsList chats={chats} />}
                </ul>
            </div>
            </aside>
            <div className="p-4 sm:ml-64">
                <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center justify-center h-24 rounded text-2xl text-gray-400 dark:text-gray-500">
                            {conversations && <ConversationsList conversations={conversations.conversation} />}
                        </div>
                    </div>
                </div>
                <form onSubmit={handleFormSubmit}>    
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
            <div className='inline-flex w-full justify-end'>
                <button
                onClick={logout}
                className='inline-flex justify-center mx-8 py-2 px-4 border border-transparent shadow-md text-sm font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                >
                logout
                </button>
            </div>
        </div>
    )
}