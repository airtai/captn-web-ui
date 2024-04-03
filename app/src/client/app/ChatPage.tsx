import { useSocket, useSocketListener } from 'wasp/client/webSocket';
import { type User } from 'wasp/entities';

import {
  updateCurrentChat,
  useQuery,
  getChat,
  getChatFromUUID,
  getConversations,
} from 'wasp/client/operations';

import { useHistory, useLocation, Redirect } from 'react-router-dom';

import ChatLayout from './layout/ChatLayout';
import ConversationsList from '../components/ConversationList';

import createAuthRequiredChatPage from '../auth/createAuthRequiredChatPage';
import {
  updateCurrentChatStatus,
  getInProgressConversation,
  getFormattedChatMessages,
  handleDailyAnalysisChat,
  callOpenAiAgent,
  handleChatError,
} from '../utils/chatUtils';

const ChatPage = ({ user }: { user: User }) => {
  const { socket } = useSocket();
  const location = useLocation();
  const { pathname } = location;
  const history = useHistory();
  const queryParams = new URLSearchParams(location.search);

  const uuidFromURL = pathname.split('/').pop();
  const activeChatUUId = uuidFromURL === 'chat' ? null : uuidFromURL;
  const { data: activeChat } = useQuery(getChatFromUUID, {
    chatUUID: activeChatUUId,
  });
  const activeChatId = Number(activeChat?.id);
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

  useSocketListener('smartSuggestionsAddedToDB', updateState);
  useSocketListener('streamFromTeamFinished', updateState);

  function updateState() {
    refetchConversation();
    refetchChat();
  }

  // Function to remove query parameters
  const removeQueryParameters = () => {
    history.push({
      search: '', // This removes all query parameters
    });
  };

  const handleFormSubmit = async (
    userQuery: string,
    isUserRespondedWithNextAction: boolean = false
  ) => {
    if (currentChatDetails.userId !== user.id) {
      window.alert('Error: This chat does not belong to you.');
    } else {
      let inProgressConversation;
      try {
        await updateCurrentChatStatus(
          activeChatId,
          isUserRespondedWithNextAction,
          removeQueryParameters
        );
        const messages: any = await getFormattedChatMessages(
          activeChatId,
          userQuery
        );
        inProgressConversation = await getInProgressConversation(
          activeChatId,
          userQuery
        );
        // if the chat has customerBrief already then directly send required detalils in socket event
        if (
          currentChatDetails.customerBrief ||
          currentChatDetails.chatType === 'daily_analysis'
        ) {
          await handleDailyAnalysisChat(
            socket,
            currentChatDetails,
            inProgressConversation,
            userQuery,
            messages,
            activeChatId
          );
        } else {
          await callOpenAiAgent(
            activeChatId,
            currentChatDetails,
            inProgressConversation,
            socket,
            messages
          );
        }
      } catch (err: any) {
        await handleChatError(
          err,
          activeChatId,
          inProgressConversation,
          history
        );
      }
    }
  };

  const onStreamAnimationComplete = () => {
    updateCurrentChat({
      id: activeChatId,
      data: {
        streamAgentResponse: false,
      },
    });
  };

  let googleRedirectLoginMsg = queryParams.get('msg');
  if (
    googleRedirectLoginMsg &&
    currentChatDetails?.userRespondedWithNextAction
  ) {
    googleRedirectLoginMsg = null;
  }

  const userSelectedAction: any = queryParams.get('selected_user_action');
  let userSelectedActionMessage: string | null = null;

  if (userSelectedAction) {
    if (!currentChatDetails?.userRespondedWithNextAction) {
      if (currentChatDetails?.proposedUserAction) {
        userSelectedActionMessage =
          currentChatDetails.proposedUserAction[Number(userSelectedAction) - 1];
      }
    }
  }

  return (
    <ChatLayout
      handleFormSubmit={handleFormSubmit}
      currentChatDetails={currentChatDetails}
      googleRedirectLoginMsg={googleRedirectLoginMsg}
    >
      <div className='flex h-full flex-col'>
        {currentChatDetails ? (
          <div className='flex-1 overflow-hidden'>
            {conversations && (
              <ConversationsList
                conversations={conversations}
                currentChatDetails={currentChatDetails}
                handleFormSubmit={handleFormSubmit}
                userSelectedActionMessage={userSelectedActionMessage}
                onStreamAnimationComplete={onStreamAnimationComplete}
              />
            )}
          </div>
        ) : (
          <DefaultMessage />
        )}
      </div>
    </ChatLayout>
  );
};

// export default ChatPage;

export default createAuthRequiredChatPage(ChatPage);

function DefaultMessage() {
  return (
    <p
      className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl md:text-6xl text-captn-light-cream opacity-70'
      style={{ lineHeight: 'normal' }}
    >
      Please initiate a new chat or select existing chats to resume your
      conversation.
    </p>
  );
}
