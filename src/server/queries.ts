import HttpError from "@wasp/core/HttpError.js";

import type { Chat, Conversation } from "@wasp/entities";
import type { GetChats, GetChat, GetConversations } from "@wasp/queries/types";

export const getChats: GetChats<void, Chat[]> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }
  return context.entities.Chat.findMany({
    where: {
      user: {
        id: context.user.id,
      },
    },
    orderBy: { id: "desc" },
  });
};

type GetChatPayload = {
  chatId: number;
};

export const getChat: GetChat<GetChatPayload, Chat> = async (
  args: any,
  context: any
) => {
  if (!context.user) {
    throw new HttpError(401);
  }
  return context.entities.Chat.findUnique({
    where: {
      id: args.chatId,
    },
  });
};

type GetConversationPayload = {
  chatId: number;
};

export const getConversations: GetConversations<
  GetConversationPayload,
  Conversation[]
> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }
  try {
    const conversation = context.entities.Conversation.findMany({
      where: { chatId: args.chatId, userId: context.user.id },
      orderBy: { id: "asc" },
    });
    return conversation;
  } catch (error) {
    console.error("Error while fetching conversations:", error);
    return [];
  }
};
