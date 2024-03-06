import type { User } from '@wasp/entities';
import { useHistory, useLocation, Redirect } from 'react-router-dom';

import { useQuery } from '@wasp/queries';
import getChat from '@wasp/queries/getChat';
import getAgentResponse from '@wasp/actions/getAgentResponse';
import createNewAndReturnAllConversations from '@wasp/actions/createNewAndReturnAllConversations';
import updateCurrentChat from '@wasp/actions/updateCurrentChat';
import type { Conversation } from '@wasp/entities';
import { useSocket, useSocketListener } from '@wasp/webSocket';

import getConversations from '@wasp/queries/getConversations';
import ChatLayout from './layout/ChatLayout';
import ConversationsList from '../components/ConversationList';
import AnimatedCharacterLoader from '../components/AnimatedCharacterLoader';

import createAuthRequiredChatPage from '../auth/createAuthRequiredChatPage';
import { use } from 'chai';

const exceptionMessage =
  "Ahoy, mate! It seems our voyage hit an unexpected squall. Let's trim the sails and set a new course. Cast off once more by clicking the button below.";

const Loader = () => {
  return (
    <div className='absolute top-[38%] left-[45%] -translate-y-2/4 -translate-x-2/4'>
      <div className='w-12 h-12 border-4 border-white rounded-full animate-spin border-t-captn-light-blue border-t-4'></div>
    </div>
  );
};

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

const ChatPage = ({ user }: { user: User }) => {
  const { socket } = useSocket();
  const location = useLocation();
  const { pathname } = location;
  const history = useHistory();
  const queryParams = new URLSearchParams(location.search);

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

  useSocketListener('newConversationAddedToDB', updateState);
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
      try {
        isUserRespondedWithNextAction && removeQueryParameters();
        await updateCurrentChat({
          id: activeChatId,
          data: {
            smartSuggestions: { suggestions: [''], type: '' },
            userRespondedWithNextAction: isUserRespondedWithNextAction,
          },
        });
        const allConversations = await createNewAndReturnAllConversations({
          chatId: activeChatId,
          userQuery,
          role: 'user',
        });
        const messages: any = prepareOpenAIRequest(allConversations);
        await updateCurrentChat({
          id: activeChatId,
          data: {
            showLoader: true,
          },
        });
        // if the chat has customerBrief already then directly send required detalils in socket event
        if (currentChatDetails.customerBrief) {
          console.log('Sending message to the same socket');
          socket.emit(
            'sendMessageToTeam',
            currentChatDetails.userId,
            currentChatDetails.id,
            userQuery
          );
          await updateCurrentChat({
            id: activeChatId,
            data: {
              showLoader: false,
              team_status: 'inprogress',
            },
          });
        } else {
          const response = await getAgentResponse({
            chatId: activeChatId,
            messages: messages,
            team_id: currentChatDetails.team_id,
            chatType: currentChatDetails.chatType,
            agentChatHistory: currentChatDetails.agentChatHistory,
            proposedUserAction: currentChatDetails.proposedUserAction,
          });
          // if (response.team_status === 'inprogress') {
          //   socket.emit('newConversationAdded', activeChatId);
          // }
          if (!!response.customer_brief) {
            socket.emit(
              'sendMessageToTeam',
              currentChatDetails.userId,
              currentChatDetails.id,
              response.customer_brief
            );
          }
          // Emit an event to check the smartSuggestion status
          if (response['content'] && !response['is_exception_occured']) {
            socket.emit('checkSmartSuggestionStatus', activeChatId);
            await updateCurrentChat({
              id: activeChatId,
              data: {
                streamAgentResponse: true,
                showLoader: false,
                smartSuggestions: response['smart_suggestions'],
              },
            });
          }

          response['content'] &&
            (await createNewAndReturnAllConversations({
              chatId: activeChatId,
              userQuery: response['content'],
              role: 'assistant',
            }));

          await updateCurrentChat({
            id: activeChatId,
            data: {
              showLoader: false,
              team_id: response['team_id'],
              team_name: response['team_name'],
              team_status: response['team_status'],
              smartSuggestions: response['smart_suggestions'],
              isExceptionOccured: response['is_exception_occured'] || false,
              customerBrief: response['customer_brief'],
            },
          });
        }
      } catch (err: any) {
        await updateCurrentChat({
          id: activeChatId,
          data: { showLoader: false },
        });
        console.log('Error: ' + err.message);
        if (err.message === 'No Subscription Found') {
          history.push('/pricing');
        } else {
          await createNewAndReturnAllConversations({
            chatId: activeChatId,
            userQuery: exceptionMessage,
            role: 'assistant',
          });
          await updateCurrentChat({
            id: activeChatId,
            data: {
              showLoader: false,
              smartSuggestions: {
                suggestions: ["Let's try again"],
                type: 'oneOf',
              },
              isExceptionOccured: true,
            },
          });
        }
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
            {currentChatDetails?.showLoader && <AnimatedCharacterLoader />}
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
