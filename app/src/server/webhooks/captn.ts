import {
  CaptnDailyAnalysisWebhook,
  CreateNewChatWebhook,
  DeleteChatWebhook,
} from '@wasp/apis/types';

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

export const captnDailyAnalysisWebhook: CaptnDailyAnalysisWebhook = async (
  request,
  response,
  context
) => {
  const userId = Number(request.body.userId);
  const chatId = Number(request.body.chatId);
  const chat = await context.entities.Chat.findFirst({
    where: {
      userId: userId,
      id: chatId,
    },
    select: {
      id: true,
    },
  });
  if (chat) {
    const updatedChat = await context.entities.Chat.update({
      where: {
        id: chatId,
      },
      data: {
        agentChatHistory: request.body.messages,
        proposedUserAction: request.body.proposed_user_action,
        emailContent: request.body.email_content,
        smartSuggestions: {
          suggestions: request.body.proposed_user_action,
          type: 'manyOf',
        },
      },
    });

    const proposedUserActionList = updatedChat.proposedUserAction
      .map((action, index) => `${index + 1}. ${action}`)
      .join('\n');

    const conversationMessage = `${request.body.initial_message_in_chat}\n\n<b>Proposed User Actions:</b>\n${proposedUserActionList}`;

    await createConversation(
      conversationMessage,
      context,
      updatedChat.id,
      userId
    );

    response.json({
      chatId: chat.id,
    });
  } else {
    console.log(
      `Invalid chat id or user id: chatId = ${chatId}, userId = ${userId}`
    );
    response
      .status(400)
      .send(
        `Webhook Error: Invalid chat id or user id: chatId = ${chatId}, userId = ${userId}`
      );
  }
};

export const createNewChatWebhook: CreateNewChatWebhook = async (
  request,
  response,
  context
) => {
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
      },
    });

    response.json({
      chatId: chat.id,
    });
  } else {
    console.log('Invalid user id: ', userId);
    response.status(400).send(`Webhook Error: Invalid user id ${userId}`);
  }
};

export const deleteChatWebhook: DeleteChatWebhook = async (
  request,
  response,
  context
) => {
  const userId = Number(request.body.userId);
  const chatId = Number(request.body.chatId);
  const chat = await context.entities.Chat.findFirst({
    where: {
      userId: userId,
      id: chatId,
    },
    select: {
      id: true,
    },
  });
  if (chat) {
    await context.entities.Chat.delete({
      where: {
        id: chatId,
      },
    });

    response.json({
      chatId: chat.id,
    });
  } else {
    console.log(
      `Invalid chat id or user id: chatId = ${chatId}, userId = ${userId}`
    );
    response
      .status(400)
      .send(
        `Webhook Error: Invalid chat id or user id: chatId = ${chatId}, userId = ${userId}`
      );
  }
};
