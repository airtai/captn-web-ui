import fetch from 'node-fetch';
import HttpError from '@wasp/core/HttpError.js';
// import type { RelatedObject } from '@wasp/entities';
import type { Chat } from '@wasp/entities';
import type { Conversation } from '@wasp/entities';
import type { GenerateGptResponse, StripePayment, CreateChat, UpdateConversation, GetAgentResponse } from '@wasp/actions/types';
import type { StripePaymentResult, OpenAIResponse } from './types';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_KEY!, {
  apiVersion: '2022-11-15',
});

// WASP_WEB_CLIENT_URL will be set up by Wasp when deploying to production: https://wasp-lang.dev/docs/deploying
const DOMAIN = process.env.WASP_WEB_CLIENT_URL || 'http://localhost:3000';

// Python ADS_SERVER_URL
const ADS_SERVER_URL = process.env.ADS_SERVER_URL || 'http://127.0.0.1:9000';

export const stripePayment: StripePayment<void, StripePaymentResult> = async (_args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }
  
  let customer: Stripe.Customer;
  const stripeCustomers = await stripe.customers.list({
    email: context.user.email!,
  });
  if (!stripeCustomers.data.length) {
    console.log('creating customer');
    customer = await stripe.customers.create({
      email: context.user.email!,
    });
  } else {
    console.log('using existing customer');
    customer = stripeCustomers.data[0];
  }

  const session: Stripe.Checkout.Session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: process.env.SUBSCRIPTION_PRICE_ID!,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${DOMAIN}/checkout?success=true`,
    cancel_url: `${DOMAIN}/checkout?canceled=true`,
    automatic_tax: { enabled: true },
    customer_update: {
      address: 'auto',
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
    throw new HttpError(402, 'Could not create a Stripe session');
  } else {
    return {
      sessionUrl: session.url,
      sessionId: session.id,
    };
  }
};

type GptPayload = {
  instructions: string;
  command: string;
  temperature: number;
};

// export const generateGptResponse: GenerateGptResponse<GptPayload, RelatedObject> = async (
export const generateGptResponse: GenerateGptResponse<GptPayload> = async (
  { instructions, command, temperature },
  context
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const payload = {
    // model: 'gpt-3.5-turbo',
    // engine:"airt-canada-gpt35-turbo-16k",
    messages: [
      {
        role: 'system',
        content: instructions,
      },
      {
        role: 'user',
        content: command,
      },
    ],
    temperature: Number(temperature),
  };

  try {
    // if (!context.user.hasPaid && !context.user.credits) {
    //   throw new HttpError(402, 'User has not paid or is out of credits');
    // } else if (context.user.credits && !context.user.hasPaid) {
    //   console.log('decrementing credits');
    //   await context.entities.User.update({
    //     where: { id: context.user.id },
    //     data: {
    //       credits: {
    //         decrement: 1,
    //       },
    //     },
    //   });
    // }

    console.log('fetching', payload);
    // https://api.openai.com/v1/chat/completions
    const response = await fetch('https://airt-openai-canada.openai.azure.com/openai/deployments/airt-canada-gpt35-turbo-16k/chat/completions?api-version=2023-07-01-preview', {
      headers: {
        'Content-Type': 'application/json',
        // Authorization: `Bearer ${process.env.AZURE_OPENAI_API_KEY!}`,
        'api-key': `${process.env.AZURE_OPENAI_API_KEY!}`,
      },
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const json = (await response.json()) as OpenAIResponse;
    console.log('response json', json);
    // return context.entities.RelatedObject.create({
    //   data: {
    //     content: json?.choices[0].message.content,
    //     user: { connect: { id: context.user.id } },
    //   },
    // });
    return {
      content: json?.choices[0].message.content,
    }
  } catch (error: any) {
    if (!context.user.hasPaid && error?.statusCode != 402) {
      await context.entities.User.update({
        where: { id: context.user.id },
        data: {
          credits: {
            increment: 1,
          },
        },
      });
    }
    console.error(error);
  }

  throw new HttpError(500, 'Something went wrong');
};



export const createChat: CreateChat<void, Conversation> = async (_args, context) => {
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
      conversation: [
        {
            role: 'assistant',
            content: `Hi! I am Captn and I am here to help you with digital marketing. I can create and optimise marketing campaigns for you.  But before I propose any activities, please let me know a little bit about your business and what your marketing goals are.`,
        },
    ],
      chat: { connect: { id: chat.id } },
    },
  });
}

type UpdateConversationPayload = {
  conversation_id: number;
  conversations: any;
};

export const updateConversation: UpdateConversation<UpdateConversationPayload, Conversation> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }
  return context.entities.Conversation.update({
    where: { id: args.conversation_id },
    data: {
      conversation: args.conversations
    },
  })
}

type AgentPayload = {
  message: string;
  conv_id: number;
};

export const getAgentResponse: GetAgentResponse<AgentPayload> = async (
  { message, conv_id },
  context
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const payload = { message: message, conv_id: conv_id, user_id: context.user.id };
  console.log("===========")
  console.log("Payload to Python server")
  console.log(payload)
  console.log("===========")
  try {
    const response = await fetch(`${ADS_SERVER_URL}/chat`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await response.json() as { detail?: string }; // Parse JSON once

    if (!response.ok) {
      const errorMsg = json.detail || `HTTP error with status code ${response.status}`;
      console.error('Server Error:', errorMsg);
      throw new Error(errorMsg);
    }

    return { content: json };

  } catch (error: any) {
    throw new HttpError(500, 'Something went wrong. Please try again later');
  }
};
