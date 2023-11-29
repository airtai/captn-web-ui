import HttpError from "@wasp/core/HttpError.js";

import type { Chat, Conversation } from "@wasp/entities";
import type { GetChats, GetConversations } from "@wasp/queries/types";

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
  return context.entities.Conversation.findMany({
    where: { chatId: args.chatId, userId: context.user.id },
  });
};
