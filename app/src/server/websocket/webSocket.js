import HttpError from '@wasp/core/HttpError.js';
import WebSocket from 'ws';

export const ADS_SERVER_URL =
  process.env.ADS_SERVER_URL || 'http://127.0.0.1:9000';

const protocol = ADS_SERVER_URL === 'http://127.0.0.1:9000' ? 'ws' : 'wss';
const WS_URL = `${protocol}://${
  ADS_SERVER_URL.split('//')[1].split(':')[0]
}:8080`;

async function checkTeamStatus(context, socket, chat_id) {
  let json;
  try {
    while (true) {
      // Infinite loop, adjust the exit condition as needed
      const payload = {
        team_id: chat_id,
      };
      const response = await fetch(`${ADS_SERVER_URL}/openai/get-team-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorMsg = `HTTP error with status code ${response.status}`;
        console.error('Server Error:', errorMsg);
      } else {
        json = await response.json();
        const team_status = json['team_status'];

        if (team_status === 'completed' || team_status === 'pause') {
          // Exit the loop when the desired condition is met
          break;
        }
      }
      // Add a 1-second delay before the next iteration
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    // Call another function after breaking the loop
    await updateConversationsInDb(context, socket, json, chat_id);
  } catch (error) {
    console.log(`Error while fetching record`);
    console.log(error);
  }
}

async function updateConversationsInDb(context, socket, json, chat_id) {
  await context.entities.Chat.update({
    where: {
      // userId: socket.data.user.id,
      id: chat_id,
    },
    data: {
      team_status: null,
      smartSuggestions: json['smart_suggestions'],
      isExceptionOccured: json['is_exception_occured'],
    },
  });

  await context.entities.Conversation.create({
    data: {
      message: json['msg'],
      role: 'assistant',
      chat: { connect: { id: chat_id } },
      user: { connect: { id: socket.data.user.id } },
    },
  });

  socket.emit('newConversationAddedToDB');
}

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
  agentConversationHistory
) {
  let jsonString = message.replace(/True/g, true).replace(/False/g, false);
  let obj = JSON.parse(jsonString);
  await context.entities.Conversation.update({
    where: {
      id: conversationId,
    },
    data: {
      isLoading: false,
      message: obj.message,
      agentConversationHistory,
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
  chatId,
  userId,
  conversationId,
  message
) {
  const ws = new WebSocket(WS_URL);
  const data = {
    conv_id: chatId,
    user_id: userId,
    message: message,
  };
  let agentConversationHistory = '';
  let lastMessage = null;
  ws.onopen = () => {
    ws.send(JSON.stringify(data));
  };
  ws.onmessage = function (event) {
    agentConversationHistory = agentConversationHistory + event.data;
    lastMessage = event.data;
    socket.emit('newMessageFromTeam', agentConversationHistory);
  };
  ws.onerror = function (event) {
    console.error('WebSocket error observed: ', event);
  };
  ws.onclose = async function (event) {
    if (event.code === 1000) {
      await updateDB(
        context,
        chatId,
        lastMessage,
        conversationId,
        agentConversationHistory
      );
      socket.emit('streamFromTeamFinished');
    }
    console.log('WebSocket is closed now.');
    console.log('Close event code: ', event.code);
  };
}

export const socketFn = (io, context) => {
  // When a new user is connected
  io.on('connection', async (socket) => {
    if (socket.data.user) {
      const userEmail = socket.data.user.email;
      console.log('========');
      console.log('a user connected: ', userEmail);

      // socket.on('newConversationAdded', async (chat_id) => {
      //   await checkTeamStatus(context, socket, chat_id);
      // });

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
        async (userId, chatId, conversationId, message) => {
          wsConnection(
            socket,
            context,
            chatId,
            userId,
            conversationId,
            message
          );
        }
      );
    }
  });
};
