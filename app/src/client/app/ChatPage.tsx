import type { User } from '@wasp/entities';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@wasp/queries';
import getChat from '@wasp/queries/getChat';

import getConversations from '@wasp/queries/getConversations';
import ChatLayout from './layout/ChatLayout';
import ConversationsList from '../components/ConversationList';

const Loader = () => {
  return (
    <div className='absolute top-[38%] left-[45%] -translate-y-2/4 -translate-x-2/4'>
      <div className='w-12 h-12 border-4 border-white rounded-full animate-spin border-t-captn-light-blue border-t-4'></div>
    </div>
  );
};

const ChatPage = ({ user }: { user: User }) => {
  // Create all api calls required for chat page here
  const location = useLocation();
  const { pathname } = location;
  const activeChatId = Number(pathname.split('/').pop());
  const {
    data: currentChatDetails,
    refetch: refetchChat,
  }: { data: any; refetch: any } = useQuery(
    getChat,
    { chatId: activeChatId },
    { enabled: !!activeChatId }
  );
  const { data: conversations, refetch: refetchConversation } = useQuery(
    getConversations,
    { chatId: activeChatId },
    { enabled: !!activeChatId }
  );

  return (
    <ChatLayout activeChatId={activeChatId}>
      <div className='flex h-full flex-col'>
        <div
          className={`flex-1 overflow-hidden ${
            currentChatDetails?.showLoader ? 'opacity-60' : 'opacity-100'
          }`}
        >
          {conversations && <ConversationsList conversations={conversations} />}
          {currentChatDetails?.showLoader && <Loader />}
        </div>
      </div>
    </ChatLayout>
  );
};

export default ChatPage;
