import HttpError from '@wasp/core/HttpError.js';
import type {
  DailyStats,
  User,
  PageViewSource,
  Chat,
  Conversation,
} from '@wasp/entities';
import type {
  GetDailyStats,
  GetPaginatedUsers,
  GetChats,
  GetConversations,
  GetChat,
} from '@wasp/queries/types';

type DailyStatsWithSources = DailyStats & {
  sources: PageViewSource[];
};

type DailyStatsValues = {
  dailyStats: DailyStatsWithSources;
  weeklyStats: DailyStatsWithSources[];
};

export const getDailyStats: GetDailyStats<void, DailyStatsValues> = async (
  _args,
  context
) => {
  if (!context.user?.isAdmin) {
    throw new HttpError(401);
  }
  const dailyStats = await context.entities.DailyStats.findFirstOrThrow({
    orderBy: {
      date: 'desc',
    },
    include: {
      sources: true,
    },
  });

  const weeklyStats = await context.entities.DailyStats.findMany({
    orderBy: {
      date: 'desc',
    },
    take: 7,
    include: {
      sources: true,
    },
  });

  return { dailyStats, weeklyStats };
};

type GetPaginatedUsersInput = {
  skip: number;
  cursor?: number | undefined;
  hasPaidFilter: boolean | undefined;
  emailContains?: string;
  subscriptionStatus?: string[];
};
type GetPaginatedUsersOutput = {
  users: Pick<
    User,
    | 'id'
    | 'email'
    | 'username'
    | 'lastActiveTimestamp'
    | 'hasPaid'
    | 'subscriptionStatus'
    | 'stripeId'
  >[];
  totalPages: number;
};

export const getPaginatedUsers: GetPaginatedUsers<
  GetPaginatedUsersInput,
  GetPaginatedUsersOutput
> = async (args, context) => {
  let subscriptionStatus = args.subscriptionStatus?.filter(
    (status) => status !== 'hasPaid'
  );
  subscriptionStatus = subscriptionStatus?.length
    ? subscriptionStatus
    : undefined;

  const queryResults = await context.entities.User.findMany({
    skip: args.skip,
    take: 10,
    where: {
      email: {
        contains: args.emailContains || undefined,
        mode: 'insensitive',
      },
      hasPaid: args.hasPaidFilter,
      subscriptionStatus: {
        in: subscriptionStatus || undefined,
      },
    },
    select: {
      id: true,
      email: true,
      username: true,
      lastActiveTimestamp: true,
      hasPaid: true,
      subscriptionStatus: true,
      stripeId: true,
    },
    orderBy: {
      id: 'desc',
    },
  });

  const totalUserCount = await context.entities.User.count({
    where: {
      email: {
        contains: args.emailContains || undefined,
      },
      hasPaid: args.hasPaidFilter,
      subscriptionStatus: {
        in: subscriptionStatus || undefined,
      },
    },
  });
  const totalPages = Math.ceil(totalUserCount / 10);

  return {
    users: queryResults,
    totalPages,
  };
};

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
    orderBy: { id: 'desc' },
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
      orderBy: { id: 'asc' },
    });
    return conversation;
  } catch (error) {
    console.error('Error while fetching conversations:', error);
    return [];
  }
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
