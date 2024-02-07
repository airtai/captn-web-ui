import { useState, ReactNode, FC } from 'react';
import createNewConversation from '@wasp/actions/createNewConversation';
import updateCurrentChat from '@wasp/actions/updateCurrentChat';

import Header from '../../admin/components/Header';
import ChatSidebar from '../../components/ChatSidebar';
import ChatForm from '../../components/ChatForm';
import useAuth from '@wasp/auth/useAuth';
import type { Conversation } from '@wasp/entities';
import getAgentResponse from '@wasp/actions/getAgentResponse';

type OutputMessage = {
  role: string;
  content: string;
};

export function prepareOpenAIRequest(input: Conversation[]): OutputMessage[] {
  const messages: OutputMessage[] = input.map((message) => {
    return {
      role: message.role,
      content: message.message,
    };
  });
  return messages;
}

interface Props {
  children?: ReactNode;
  activeChatId: number;
}

const ChatLayout: FC<Props> = ({ children, activeChatId }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: user } = useAuth();

  const handleFormSubmit = async (userQuery: string) => {
    const allConversations = await createNewConversation({
      chatId: activeChatId,
      userQuery,
      role: 'user',
    });
    const messages: any = prepareOpenAIRequest(allConversations);
    await updateCurrentChat({
      id: activeChatId,
      data: { showLoader: true },
    });
    const response = await getAgentResponse({
      chatId: activeChatId,
      messages: messages,
      team_id: null,
      chatType: null,
      agentChatHistory: null,
      proposedUserAction: null,
    });
    console.log('response: ', response);
    await createNewConversation({
      chatId: activeChatId,
      userQuery: response['content'],
      role: 'assistant',
    });
    await updateCurrentChat({
      id: activeChatId,
      data: { showLoader: false },
    });
  };
  // make call to api -> from action file access conversation entity and pass it to openai
  // get response from openai and save it against the conversation

  return (
    <div className='dark:bg-boxdark-2 dark:text-bodydark bg-captn-light-blue'>
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className='flex h-screen overflow-hidden'>
        {/* <!-- ===== Sidebar Start ===== --> */}
        <ChatSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div className='relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden'>
          {/* <!-- ===== Header Start ===== --> */}
          <Header
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            user={user}
          />
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main className='flex-auto overflow-y-auto'>
            <div>{children}</div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
          <ChatForm handleFormSubmit={handleFormSubmit} />
        </div>

        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </div>
  );
};

export default ChatLayout;
