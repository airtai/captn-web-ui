import fetch from "node-fetch";
import HttpError from "@wasp/core/HttpError.js";
// import type { RelatedObject } from '@wasp/entities';
import type { Chat } from "@wasp/entities";
import type { Conversation } from "@wasp/entities";
import type {
  StripePayment,
  CreateChat,
  AddNewConversationToChat,
  UpdateExistingChat,
  GetAgentResponse,
} from "@wasp/actions/types";
import type { StripePaymentResult, OpenAIResponse } from "./types";
import Stripe from "stripe";

import { ADS_SERVER_URL, DOMAIN } from "./config.js";

const stripe = new Stripe(process.env.STRIPE_KEY!, {
  apiVersion: "2022-11-15",
});

export const stripePayment: StripePayment<void, StripePaymentResult> = async (
  _args,
  context
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  let customer: Stripe.Customer;
  const stripeCustomers = await stripe.customers.list({
    email: context.user.email!,
  });
  if (!stripeCustomers.data.length) {
    console.log("creating customer");
    customer = await stripe.customers.create({
      email: context.user.email!,
    });
  } else {
    console.log("using existing customer");
    customer = stripeCustomers.data[0];
  }

  const session: Stripe.Checkout.Session =
    await stripe.checkout.sessions.create({
      line_items: [
        {
          price: process.env.SUBSCRIPTION_PRICE_ID!,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${DOMAIN}/checkout?success=true`,
      cancel_url: `${DOMAIN}/checkout?canceled=true`,
      automatic_tax: { enabled: true },
      customer_update: {
        address: "auto",
      },
      customer: customer.id,
    });

  await context.entities.User.update({
    where: {
      id: context.user.id,
    },
    data: {
      checkoutSessionId: session?.id ?? null,
      stripeId: customer.id ?? null,
    },
  });

  if (!session) {
    throw new HttpError(402, "Could not create a Stripe session");
  } else {
    return {
      sessionUrl: session.url,
      sessionId: session.id,
    };
  }
};

export const createChat: CreateChat<void, Conversation> = async (
  _args,
  context
) => {
  if (!context.user) {
    throw new HttpError(401);
  }
  const chat = await context.entities.Chat.create({
    data: {
      user: { connect: { id: context.user.id } },
    },
  });

  return await context.entities.Conversation.create({
    data: {
      message:
        "Hi! I am Captn and I am here to help you with digital marketing. I can create and optimise marketing campaigns for you.  But before I propose any activities, please let me know a little bit about your business and what your marketing goals are.",
      role: "assistant",
      chat: { connect: { id: chat.id } },
      user: { connect: { id: context.user.id } },
    },
  });
};

type AddNewConversationToChatPayload = {
  message: string;
  role: string;
  chat_id: number;
};

export const addNewConversationToChat: AddNewConversationToChat<
  AddNewConversationToChatPayload,
  Conversation[]
> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  await context.entities.Conversation.create({
    data: {
      message: args.message,
      role: args.role,
      chat: { connect: { id: args.chat_id } },
      user: { connect: { id: context.user.id } },
      // ...(args.team_name && { team_name: args.team_name }),
      // ...(args.team_id && { team_id: args.team_id }),
      // ...(args.team_status && { team_status: args.team_status }),
    },
  });

  return context.entities.Conversation.findMany({
    where: { chatId: args.chat_id, userId: context.user.id },
    orderBy: { id: "asc" },
  });
};

type UpdateExistingChatPayload = {
  chat_id: number;
  team_name: string;
  team_id: number;
  team_status: boolean;
};

export const updateExistingChat: UpdateExistingChat<
  UpdateExistingChatPayload,
  void
> = async (args: any, context: any) => {
  if (!context.user) {
    throw new HttpError(401);
  }
  await context.entities.Chat.update({
    where: {
      id: args.chat_id,
    },
    data: {
      team_id: args.team_id,
      team_name: args.team_name,
      team_status: args.team_status,
    },
  });
};

type AgentPayload = {
  chat_id: number;
  message: any;
  team_id: number | null | undefined;
};

export const getAgentResponse: GetAgentResponse<AgentPayload> = async (
  {
    chat_id,
    message,
    team_id,
  }: {
    chat_id: number;
    message: any;
    team_id: number | null | undefined;
  },
  context: any
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const payload = {
    chat_id: chat_id,
    message: message,
    user_id: context.user.id,
    team_id: team_id,
  };
  console.log("===========");
  console.log("Payload to Python server");
  console.log(payload);
  console.log("===========");
  try {
    const response = await fetch(`${ADS_SERVER_URL}/openai/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json: any = (await response.json()) as { detail?: string }; // Parse JSON once

    if (!response.ok) {
      const errorMsg =
        json.detail || `HTTP error with status code ${response.status}`;
      console.error("Server Error:", errorMsg);
      throw new Error(errorMsg);
    }

    return {
      content: json["content"],
      team_status: json["team_status"],
      team_name: json["team_name"],
      team_id: json["team_id"],
    };
  } catch (error: any) {
    throw new HttpError(500, "Something went wrong. Please try again later");
  }
};
