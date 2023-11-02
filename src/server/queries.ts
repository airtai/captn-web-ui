import HttpError from '@wasp/core/HttpError.js';

// import type { RelatedObject } from '@wasp/entities';
// import type { GetRelatedObjects } from '@wasp/queries/types';

import type { Chat, Conversation } from '@wasp/entities';
import type { GetChats, GetConversations } from '@wasp/queries/types';

// import type { Conversation } from '@wasp/entities';
// import type { GetConversations } from '@wasp/queries/types';

// export const getRelatedObjects: GetRelatedObjects<void, RelatedObject[]> = async (args, context) => {
//   if (!context.user) {
//     throw new HttpError(401);
//   }
//   return context.entities.RelatedObject.findMany({
//     where: {
//       user: {
//         id: context.user.id
//       }
//     },
//   })
// }

export const getChats: GetChats<void, Chat[]> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }
  return context.entities.Chat.findMany({
    where: {
      user: {
        id: context.user.id
      }
    },
  })
}

type GetConversationPayload = {
  chatId: number
}

export const getConversations: GetConversations<GetConversationPayload, Conversation> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }
  return context.entities.Conversation.findFirstOrThrow({
    where: { chatId: args.chatId },
  })
}


// export const getConversations: GetConversations<void, Chat[]> = async (args, context) => {
//   if (!context.user) {
//     throw new HttpError(401);
//   }
//   return context.entities.Task.findMany({
//     where: {
//       chat: {
//         id: args.chat_id
//       }
//     },
//   })
// }

