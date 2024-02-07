import Stripe from 'stripe';
import fetch from 'node-fetch';
import HttpError from '@wasp/core/HttpError.js';
import type { User } from '@wasp/entities';
import type { StripePayment } from '@wasp/actions/types';
import type { StripePaymentResult } from './types';
import { UpdateCurrentUser, UpdateUserById } from '@wasp/actions/types';
import {
  fetchStripeCustomer,
  createStripeCheckoutSession,
} from './stripeUtils.js';
import { TierIds } from '@wasp/shared/constants.js';

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
