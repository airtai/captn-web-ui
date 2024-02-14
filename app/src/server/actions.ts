import Stripe from 'stripe';
import fetch from 'node-fetch';
import HttpError from '@wasp/core/HttpError.js';
import type { User, Chat, Conversation } from '@wasp/entities';
import type { StripePayment } from '@wasp/actions/types';
import type { StripePaymentResult } from './types';
import {
  UpdateCurrentUser,
  UpdateUserById,
  CreateNewChat,
  CreateNewConversation,
  UpdateCurrentChat,
  GetAgentResponse,
} from '@wasp/actions/types';
import {
  fetchStripeCustomer,
  createStripeCheckoutSession,
} from './stripeUtils.js';
import { TierIds } from '@wasp/shared/constants.js';
import { _Conversation } from '@wasp/_types';

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
        ],
      },
    },
  });

  const conversation = await context.entities.Conversation.create({
    data: {
      chat: { connect: { id: chat.id } },
      user: { connect: { id: context.user.id } },
      message:
        "Welcome aboard! I'm Captn, your digital marketing companion. Think of me as your expert sailor, ready to ensure your Google Ads journey is smooth sailing. Before we set sail, could you steer our course by sharing the business goal you'd like to improve?",
      role: 'assistant',
    },
  });

  return chat;
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

export const createNewConversation: CreateNewConversation<
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

type AgentPayload = {
  chatId: number;
  messages: any;
  team_id: number | null | undefined;
  chatType: string | null | undefined;
  agentChatHistory: string | null | undefined;
  proposedUserAction: string[] | null | undefined;
};

export const getAgentResponse: GetAgentResponse<
  AgentPayload,
  Record<string, any>
> = async (
  {
    chatId,
    messages,
    team_id,
    chatType,
    agentChatHistory,
    proposedUserAction,
  }: {
    chatId: number;
    messages: any;
    team_id: number | null | undefined;
    chatType: string | null | undefined;
    agentChatHistory: string | null | undefined;
    proposedUserAction: string[] | null | undefined;
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
    team_id: team_id,
    chat_type: chatType,
    agent_chat_history: agentChatHistory,
    proposed_user_action: proposedUserAction,
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
      ...(json['is_exception_occured'] !== undefined && {
        is_exception_occured: Boolean(json['is_exception_occured']),
      }),
    };
  } catch (error: any) {
    throw new HttpError(500, 'Something went wrong. Please try again later');
  }
};
