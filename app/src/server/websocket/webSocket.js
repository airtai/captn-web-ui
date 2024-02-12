import HttpError from '@wasp/core/HttpError.js';

export const ADS_SERVER_URL =
  process.env.ADS_SERVER_URL || 'http://127.0.0.1:9000';

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

export const checkTeamStatusAndUpdateInDB = (io, context) => {
  // When a new user is connected
  io.on('connection', async (socket) => {
    if (socket.data.user) {
      const userEmail = socket.data.user.email;
      console.log('========');
      console.log('a user connected: ', userEmail);

      socket.on('newConversationAdded', async (chat_id) => {
        await checkTeamStatus(context, socket, chat_id);
      });
    }
  });
};
