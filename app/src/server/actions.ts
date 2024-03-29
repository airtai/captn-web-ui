import { type User, type Chat, type Conversation } from 'wasp/entities';
import { HttpError } from 'wasp/server';

import {
  type StripePayment,
  type UpdateCurrentUser,
  type UpdateUserById,
  type CreateNewChat,
  type CreateNewDailyAnalysisChat,
  type CreateNewAndReturnAllConversations,
  type CreateNewAndReturnLastConversation,
  type UpdateCurrentChat,
  type UpdateCurrentConversation,
  type GetAgentResponse,
} from 'wasp/server/operations';

import Stripe from 'stripe';
import fetch from 'node-fetch';
import type { StripePaymentResult } from './types';
import {
  fetchStripeCustomer,
  createStripeCheckoutSession,
} from './stripeUtils.js';
import { TierIds } from '../shared/constants.js';
// import { _Conversation } from 'wasp/_types';

export const ADS_SERVER_URL =
  process.env.ADS_SERVER_URL || 'http://127.0.0.1:9000';

export const stripePayment: StripePayment<string, StripePaymentResult> = async (
  tier,
  context
) => {
  if (!context.user || !context.user.email) {
    throw new HttpError(401);
  }

  let priceId;
  if (tier === TierIds.HOBBY) {
    priceId = process.env.HOBBY_SUBSCRIPTION_PRICE_ID!;
  } else if (tier === TierIds.PRO) {
    priceId = process.env.PRO_SUBSCRIPTION_PRICE_ID!;
  } else {
    throw new HttpError(400, 'Invalid tier');
  }

  let customer: Stripe.Customer;
  let session: Stripe.Checkout.Session;
  try {
    customer = await fetchStripeCustomer(context.user.email);
    session = await createStripeCheckoutSession({
      priceId,
      customerId: customer.id,
    });
  } catch (error: any) {
    throw new HttpError(500, error.message);
  }

  await context.entities.User.update({
    where: {
      id: context.user.id,
    },
    data: {
      checkoutSessionId: session.id,
      stripeId: customer.id,
    },
  });

  return {
    sessionUrl: session.url,
    sessionId: session.id,
  };
};

export const updateUserById: UpdateUserById<
  { id: number; data: Partial<User> },
  User
> = async ({ id, data }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  if (!context.user.isAdmin) {
    throw new HttpError(403);
  }

  const updatedUser = await context.entities.User.update({
    where: {
      id,
    },
    data,
  });

  return updatedUser;
};

export const updateCurrentUser: UpdateCurrentUser<Partial<User>, User> = async (
  user,
  context
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  return context.entities.User.update({
    where: {
      id: context.user.id,
    },
    data: user,
  });
};

export const createNewChat: CreateNewChat<void, Chat> = async (
  user,
  context
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  if (!context.user.hasPaid) {
    throw new HttpError(500, 'No Subscription Found');
  }

  const chat = await context.entities.Chat.create({
    data: {
      user: { connect: { id: context.user.id } },
      smartSuggestions: {
        type: 'manyOf',
        suggestions: [
          'Boost sales',
          'Increase brand awareness',
          'Drive website traffic',
          'Promote a product or service',
          'Create a new Google ads campaign',
        ],
      },
    },
  });

  const conversation = await context.entities.Conversation.create({
    data: {
      chat: { connect: { id: chat.id } },
      user: { connect: { id: context.user.id } },
      message:
        "Welcome aboard! I'm Capt’n, your digital marketing companion. Think of me as your expert sailor, ready to ensure your Google Ads journey is smooth sailing. Before we set sail, could you steer our course by sharing the business goal you'd like to improve?",
      role: 'assistant',
    },
  });

  return chat;
};

export const createNewDailyAnalysisChat: CreateNewDailyAnalysisChat<
  Chat,
  Chat
> = async (currentChatDetails, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  if (!context.user.hasPaid) {
    throw new HttpError(500, 'No Subscription Found');
  }

  const newChat = await context.entities.Chat.create({
    data: {
      user: { connect: { id: context.user.id } },
      agentChatHistory: currentChatDetails.agentChatHistory,
      proposedUserAction: currentChatDetails.proposedUserAction,
      emailContent: currentChatDetails.emailContent,
      chatType: currentChatDetails.chatType,
      smartSuggestions: {
        suggestions: currentChatDetails.proposedUserAction,
        type: 'manyOf',
      },
    },
  });
  const allChatConversations = await context.entities.Conversation.findMany({
    where: { chatId: currentChatDetails.id, userId: context.user.id },
    orderBy: { id: 'asc' },
  });
  const conversationMessage = allChatConversations[0].message;

  const conversation = await context.entities.Conversation.create({
    data: {
      chat: { connect: { id: newChat.id } },
      user: { connect: { id: context.user.id } },
      message: conversationMessage,
      role: 'assistant',
    },
  });

  return newChat;
};

export const updateCurrentChat: UpdateCurrentChat<
  { id: number; data: Partial<Chat> },
  Chat
> = async ({ id, data }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const chat = await context.entities.Chat.update({
    where: {
      id: id,
    },
    data,
  });

  return chat;
};

export const updateCurrentConversation: UpdateCurrentConversation<
  { id: number; data: Partial<Conversation> },
  Conversation
> = async ({ id, data }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const conversation = await context.entities.Conversation.update({
    where: {
      id: id,
    },
    data,
  });

  return conversation;
};

export const createNewAndReturnAllConversations: CreateNewAndReturnAllConversations<
  { chatId: number; userQuery: string; role: 'user' | 'assistant' },
  Conversation[]
> = async ({ chatId, userQuery, role }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  if (!context.user.hasPaid) {
    throw new HttpError(500, 'No Subscription Found');
  }

  await context.entities.Conversation.create({
    data: {
      chat: { connect: { id: chatId } },
      user: { connect: { id: context.user.id } },
      message: userQuery,
      role,
    },
  });

  return context.entities.Conversation.findMany({
    where: { chatId: chatId, userId: context.user.id },
    orderBy: { id: 'asc' },
  });
};

export const createNewAndReturnLastConversation: CreateNewAndReturnLastConversation<
  {
    chatId: number;
    userQuery: string;
    role: 'user' | 'assistant';
    isLoading: boolean;
  },
  Conversation
> = async ({ chatId, userQuery, role, isLoading }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  if (!context.user.hasPaid) {
    throw new HttpError(500, 'No Subscription Found');
  }

  return await context.entities.Conversation.create({
    data: {
      chat: { connect: { id: chatId } },
      user: { connect: { id: context.user.id } },
      message: userQuery,
      role,
      isLoading,
    },
  });
};

type AgentPayload = {
  chatId: number;
  messages: any;
};

export const getAgentResponse: GetAgentResponse<
  AgentPayload,
  Record<string, any>
> = async (
  {
    chatId,
    messages,
  }: {
    chatId: number;
    messages: any;
  },
  context: any
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const payload = {
    chat_id: chatId,
    message: messages,
    user_id: context.user.id,
  };
  console.log('===========');
  console.log('Payload to Python server');
  console.log(payload);
  console.log('===========');
  try {
    const response = await fetch(`${ADS_SERVER_URL}/openai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const json: any = (await response.json()) as { detail?: string }; // Parse JSON once

    if (!response.ok) {
      const errorMsg =
        json.detail || `HTTP error with status code ${response.status}`;
      console.error('Server Error:', errorMsg);
      throw new Error(errorMsg);
    }

    return {
      content: json['content'],
      smart_suggestions: json['smart_suggestions'],
      team_status: json['team_status'],
      team_name: json['team_name'],
      team_id: json['team_id'],
      ...(json['customer_brief'] !== undefined && {
        customer_brief: json['customer_brief'],
      }),
      ...(json['is_exception_occured'] !== undefined && {
        is_exception_occured: Boolean(json['is_exception_occured']),
      }),
    };
  } catch (error: any) {
    throw new HttpError(500, 'Something went wrong. Please try again later');
  }
};
