import WebSocket from 'ws';

export const ADS_SERVER_URL =
  process.env.ADS_SERVER_URL || 'http://127.0.0.1:9000';

const protocol = ADS_SERVER_URL === 'http://127.0.0.1:9000' ? 'ws' : 'wss';
const WS_URL = `${protocol}://${
  ADS_SERVER_URL.split('//')[1].split(':')[0]
}:8080`;

async function getChat(chatId, context) {
  return await context.entities.Chat.findFirst({
    where: {
      id: chatId,
    },
    select: {
      id: true,
      smartSuggestions: true,
    },
  });
}

async function updateDB(
  context,
  chatId,
  message,
  conversationId,
  socketConversationHistory
) {
  let obj = {};
  try {
    const jsonString = message.replace(/True/g, true).replace(/False/g, false);
    obj = JSON.parse(jsonString);
  } catch (error) {
    obj = { message: message, smart_suggestions: [] };
  }
  await context.entities.Conversation.update({
    where: {
      id: conversationId,
    },
    data: {
      isLoading: false,
      message: obj.message,
      agentConversationHistory: socketConversationHistory,
    },
  });

  await context.entities.Chat.update({
    where: {
      id: chatId,
    },
    data: {
      team_status: 'completed',
      smartSuggestions: obj.smart_suggestions,
    },
  });
}

function wsConnection(
  socket,
  context,
  currentChatDetails,
  conversationId,
  lastMessage,
  allMessages
) {
  const ws = new WebSocket(WS_URL);
  const data = {
    conv_id: currentChatDetails.id,
    user_id: currentChatDetails.userId,
    message: lastMessage,
    agent_chat_history: currentChatDetails.agentChatHistory,
    all_messages: allMessages,
    is_continue_daily_analysis:
      currentChatDetails.chatType === 'daily_analysis' &&
      !!currentChatDetails.team_status,
  };
  let socketConversationHistory = {};
  let lastSocketMessage = null;
  ws.onopen = () => {
    ws.send(JSON.stringify(data));
  };
  ws.onmessage = function (event) {
    socketConversationHistory[`${currentChatDetails.id}`] =
      socketConversationHistory[`${currentChatDetails.id}`] + event.data;
    lastSocketMessage = event.data;
    socket.emit('newMessageFromTeam', socketConversationHistory);
  };
  ws.onerror = function (event) {
    console.error('WebSocket error observed: ', event);
  };
  ws.onclose = async function (event) {
    let message;
    if (event.code === 1000) {
      message = lastSocketMessage;
    } else {
      message =
        'We are sorry, but we are unable to continue the conversation. Please create a new chat in a few minutes to continue.';
      console.log('WebSocket is closed with the event code:', event.code);
    }
    await updateDB(
      context,
      currentChatDetails.id,
      message,
      conversationId,
      socketConversationHistory[`${currentChatDetails.id}`]
    );
    socketConversationHistory[`${currentChatDetails.id}`] = '';
    socket.emit('streamFromTeamFinished', socketConversationHistory);
  };
}

export const socketFn = (io, context) => {
  // When a new user is connected
  io.on('connection', async (socket) => {
    if (socket.data.user) {
      const userEmail = socket.data.user.email;
      console.log('========');
      console.log('a user connected: ', userEmail);

      socket.on('checkSmartSuggestionStatus', async (chatId) => {
        let isSmartSuggestionEmpty = true;
        for (let i = 0; i < 10; i++) {
          const chat = await getChat(chatId, context);
          const { suggestions } = chat.smartSuggestions;
          isSmartSuggestionEmpty =
            suggestions.length === 1 && suggestions[0] === '';

          if (isSmartSuggestionEmpty) {
            // If smart suggestions are still empty, wait for 1 second and check again
            await new Promise((resolve) => setTimeout(resolve, 1000));
          } else {
            socket.emit('smartSuggestionsAddedToDB', chatId);
            break;
          }
        }
      });

      socket.on(
        'sendMessageToTeam',
        async (
          currentChatDetails,
          conversationId,
          lastMessage,
          allMessages
        ) => {
          wsConnection(
            socket,
            context,
            currentChatDetails,
            conversationId,
            lastMessage,
            allMessages
          );
        }
      );
    }
  });
};
