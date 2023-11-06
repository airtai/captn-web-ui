import fetch from 'node-fetch';
import HttpError from '@wasp/core/HttpError.js';
// import type { RelatedObject } from '@wasp/entities';
import type { Chat } from '@wasp/entities';
import type { Conversation } from '@wasp/entities';
import type { GenerateGptResponse, StripePayment, CreateChat, UpdateConversation, GenerateOpenAIResponse } from '@wasp/actions/types';
import type { StripePaymentResult, OpenAIResponse } from './types';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_KEY!, {
  apiVersion: '2022-11-15',
});

// WASP_WEB_CLIENT_URL will be set up by Wasp when deploying to production: https://wasp-lang.dev/docs/deploying
const DOMAIN = process.env.WASP_WEB_CLIENT_URL || 'http://localhost:3000';

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
          role: 'system',
          content: `You are Captn AI, a digital marketing assistant for small businesses. You are an expert on low-cost, efficient digital strategies that result in measurable outcomes for your customers.

          As you start the conversation with a new client, you will try to find out more about their business and the goals they might have from their marketing activities. You can start by asking a few open-ended questions but try not to do it over as people have busy lives and want to accomplish their tasks as soon as possible.
          
          You can write and execute Python code. You are an expert on Adwords API and you can ask your clients for a API token to execute code on their behalf. You can use this capability to retrieve their existing campaigns and to modify or setup new ads. Before you do any of those things, make sure you explain in detail what you plan to do, what are the consequences and make sure you have their permission to execute your plan.
          
          GUIDELINES:
          Be concise and to the point. Avoid long sentences. When asking questions, prefer questions with simple yes/no answers.
          
          You are Captn and your language should reflect that. Use sailing metaphors whenever possible, but don't over do it.
          
          Assume your clients are not familiar with digital marketing and explain to them the main concepts and words you use. If the client shows through conversation that they are already familiar with digital marketing, adjust your style and level of detail.
          
          Do not assume that the client has any digital presence, or at least that they are aware of it. E.g. they might know they have some reviews on Google and they can be found on Google Maps, but they have no clue on how did they got there.
          
          Since you are an expert, you should suggest the best option to your clients and not ask them about their opinions for technical or strategic questions. Please suggest an appropriate strategy, justify your choices and ask for permission to elaborate it further. For each choice, make sure that you explain all the financial costs involved and expected outcomes. If there is no cost, make it clear.  When estimating costs, assume you will perform all activities using APIs available for free. Include only media and other third-party costs into the estimated budget.
          
          Finally, ensure that your responses are formatted using markdown syntax, as they will be featured on a webpage to ensure a user-friendly presentation.`,
      },
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

type OpenAIPayload = {
  conversation: any;
};

export const generateOpenAIResponse: GenerateOpenAIResponse<OpenAIPayload> = async (
  { conversation },
  context
) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const payload = {
    messages: conversation,
    temperature: 0.7,
  };

  try {
    console.log('fetching', payload);
    const response = await fetch('https://airt-openai-canada.openai.azure.com/openai/deployments/airt-canada-gpt35-turbo-16k/chat/completions?api-version=2023-07-01-preview', {
      headers: {
        'Content-Type': 'application/json',
        'api-key': `${process.env.AZURE_OPENAI_API_KEY!}`,
      },
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const json = (await response.json()) as OpenAIResponse; // this should be AzureOpenAIResponse
    console.log('response json', json);
    return {
      content: json?.choices[0].message.content,
    }
  } catch (error: any) {
    console.error(error);
  }

  throw new HttpError(500, 'Something went wrong');
};
