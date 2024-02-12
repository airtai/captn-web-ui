import { CaptnDailyAnalysisWebhook } from '@wasp/apis/types';

async function createConversation(
  message: string,
  context: any,
  chatId: number,
  customer_id: number
) {
  await context.entities.Conversation.create({
    data: {
      message: message,
      role: 'assistant',
      chat: { connect: { id: chatId } },
      user: { connect: { id: customer_id } },
    },
  });
}

// TODO: This function is expected to get chatID from the request body and then create a new conversation with the initial message in the chat.
export const captnDailyAnalysisWebhook: CaptnDailyAnalysisWebhook = async (
  request,
  response,
  context
) => {
  console.log('captnDailyAnalysisWebhook');
  const userId = Number(request.body.userId);
  const customer = await context.entities.User.findFirst({
    where: {
      id: userId,
    },
    select: {
      id: true,
      email: true,
    },
  });
  if (customer) {
    const chat = await context.entities.Chat.create({
      data: {
        user: { connect: { id: customer.id } },
        chatType: 'daily_analysis',
        agentChatHistory: request.body.messages,
        proposedUserAction: request.body.proposed_user_action,
        emailContent: request.body.email_content,
      },
    });

    await createConversation(
      request.body.initial_message_in_chat,
      context,
      chat.id,
      customer.id
    );

    response.json({
      chatID: chat.id,
    });
  } else {
    console.log('Invalid user id: ', userId);
    response.status(400).send(`Webhook Error: Invalid user id ${userId}`);
  }
};

// export const createNewChatWebhook: CaptnDailyAnalysisWebhook = async (
//   request,
//   response,
//   context
// ) => {
//   console.log('createNewChatWebhook');
//   const userId = Number(request.body.userId);
//   const customer = await context.entities.User.findFirst({
//     where: {
//       id: userId,
//     },
//     select: {
//       id: true,
//       email: true,
//     },
//   });
//   if (customer) {
//     const chat = await context.entities.Chat.create({
//       data: {
//         user: { connect: { id: customer.id } },
//         chatType: 'daily_analysis',
//       },
//     });

//     response.json({
//       chatID: chat.id,
//     });
//   } else {
//     console.log('Invalid user id: ', userId);
//     response.status(400).send(`Webhook Error: Invalid user id ${userId}`);
//   }
// };
