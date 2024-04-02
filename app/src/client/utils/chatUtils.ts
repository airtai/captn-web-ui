import {
  updateCurrentChat,
  updateCurrentConversation,
  createNewAndReturnAllConversations,
  createNewAndReturnLastConversation,
  getAgentResponse,
} from 'wasp/client/operations';

import { type User, type Conversation } from 'wasp/entities';

const exceptionMessage =
  "Ahoy, mate! It seems our voyage hit an unexpected squall. Let's trim the sails and set a new course. Cast off once more by clicking the button below.";

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

export async function updateCurrentChatStatus(
  activeChatId: number,
  isUserRespondedWithNextAction: boolean,
  removeQueryParameters: Function
) {
  isUserRespondedWithNextAction && removeQueryParameters();
  await updateCurrentChat({
    id: activeChatId,
    data: {
      smartSuggestions: { suggestions: [''], type: '' },
      userRespondedWithNextAction: isUserRespondedWithNextAction,
    },
  });
}

export async function getFormattedChatMessages(
  activeChatId: number,
  userQuery: string
) {
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
  return messages;
}

export async function getInProgressConversation(
  activeChatId: number,
  userQuery: string
) {
  const inProgressConversation = await createNewAndReturnLastConversation({
    chatId: activeChatId,
    userQuery,
    role: 'assistant',
    isLoading: true,
  });
  return inProgressConversation;
}

export const handleDailyAnalysisChat = async (
  socket: any,
  currentChatDetails: any,
  inProgressConversation: any,
  userQuery: string,
  messages: any,
  activeChatId: number
) => {
  const teamName =
    currentChatDetails.chatType === 'daily_analysis'
      ? `default_team_${currentChatDetails.userId}_${currentChatDetails.id}`
      : currentChatDetails.team_name;
  socket.emit(
    'sendMessageToTeam',
    currentChatDetails,
    inProgressConversation.id,
    userQuery,
    messages,
    teamName
  );
  await updateCurrentChat({
    id: activeChatId,
    data: {
      showLoader: false,
      team_status: 'inprogress',
    },
  });
};

export const callOpenAiAgent = async (
  activeChatId: number,
  currentChatDetails: any,
  inProgressConversation: any,
  socket: any,
  messages: any
) => {
  const response = await getAgentResponse({
    chatId: activeChatId,
    messages: messages,
  });
  await handleAgentResponse(
    response,
    currentChatDetails,
    inProgressConversation,
    socket,
    messages,
    activeChatId
  );
};

export const handleAgentResponse = async (
  response: any,
  currentChatDetails: any,
  inProgressConversation: any,
  socket: any,
  messages: any,
  activeChatId: number
) => {
  if (!!response.customer_brief) {
    socket.emit(
      'sendMessageToTeam',
      currentChatDetails,
      inProgressConversation.id,
      response.customer_brief,
      messages,
      response['team_name']
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
    (await updateCurrentConversation({
      id: inProgressConversation.id,
      data: {
        isLoading: false,
        message: response['content'],
      },
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
};

export const handleChatError = async (
  err: any,
  activeChatId: number,
  inProgressConversation: any,
  history: any
) => {
  await updateCurrentChat({
    id: activeChatId,
    data: { showLoader: false },
  });
  console.log('Error: ' + err.message);
  if (err.message === 'No Subscription Found') {
    history.push('/pricing');
  } else {
    await updateCurrentConversation({
      //@ts-ignore
      id: inProgressConversation.id,
      data: {
        isLoading: false,
        message: exceptionMessage,
      },
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
};
