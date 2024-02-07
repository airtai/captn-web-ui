import type { User } from '@wasp/entities';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@wasp/queries';

import getConversations from '@wasp/queries/getConversations';
import ChatLayout from './layout/ChatLayout';
import ConversationsList from '../components/ConversationList';

const ChatPage = ({ user }: { user: User }) => {
  // Create all api calls required for chat page here
  const location = useLocation();
  const { pathname } = location;
  const activeChatId = Number(pathname.split('/').pop());
  const { data: conversations, refetch: refetchConversation } = useQuery(
    getConversations,
    { chatId: activeChatId },
    { enabled: !!activeChatId }
  );

  return (
    <ChatLayout activeChatId={activeChatId}>
      <div className='flex h-full flex-col'>
        <div className='flex-1 overflow-hidden'>
          {conversations && <ConversationsList conversations={conversations} />}
        </div>
      </div>
    </ChatLayout>
  );
};

export default ChatPage;
