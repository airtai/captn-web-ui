import { User } from '@wasp/entities';
import { useQuery } from '@wasp/queries'
import getChats from '@wasp/queries/getChats'
import logout from '@wasp/auth/logout';
import { useState, Dispatch, SetStateAction } from 'react';
import { Chat } from '@wasp/entities'

import createChat from '@wasp/actions/createChat'

const ChatsList = ({ chats }: { chats: Chat[] }) => {
    const [chatConversation, setChatConversation] = useState('');
    const handleClick = async (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault()
        try {
            const newChatConversation = await createChat();
            setChatConversation(newChatConversation.conversation);
          } catch (err: any) {
            window.alert('Error: ' + err.message)
          }
        // console.log(event.target);
        // console.log(event.currentTarget);
      };
    if (!chats?.length) return <div>No chats</div>
  
    return (
      <div>
        {chats.map((chat, idx) => (
          <div key={idx}>{chat.id}</div>
        ))}
        <hr />
        <button onClick={handleClick}>Create new chat</button> 
        <hr />
        <h3>Chat conversation is below:</h3>
        {chatConversation}
      </div>
    )
  }

export default function ChatPage({ user }: { user: User }) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { data: chats, isLoading: isLoadingChats } = useQuery(getChats)

    return (
        <div className='mt-10 px-6'>
            {chats && <ChatsList chats={chats} />}
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