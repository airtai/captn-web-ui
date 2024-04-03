import { test, expect, vi, describe } from 'vitest';

import * as operations from 'wasp/client/operations';
import { type Conversation } from 'wasp/entities';

import {
  prepareOpenAIRequest,
  getFormattedChatMessages,
  updateCurrentChatStatus,
  getInProgressConversation,
  handleDailyAnalysisChat,
  handleAgentResponse,
  handleChatError,
  exceptionMessage,
} from '../utils/chatUtils';

vi.mock('wasp/client/operations', async (importOriginal) => {
  const mod = await importOriginal<typeof import('wasp/client/operations')>();
  return {
    ...mod,
    createNewAndReturnAllConversations: vi.fn().mockResolvedValue([
      { role: 'user', message: 'Hello' },
      { role: 'assistant', message: 'Hi there!' },
    ]),
    updateCurrentChat: vi.fn().mockResolvedValue(null),
    createNewAndReturnLastConversation: vi.fn().mockResolvedValue({
      role: 'assistant',
      message: 'Hi there!',
      isLoading: true,
    }),
    updateCurrentConversation: vi.fn().mockResolvedValue(null),
  };
});

describe('chatUtils', () => {
  test('prepareOpenAIRequest', () => {
    const input: Partial<Conversation>[] = [
      { role: 'user', message: 'Hello', id: 1 },
      { role: 'assistant', message: 'Hi there!', id: 5 },
    ];
    const expected = [
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hi there!' },
    ];
    // @ts-ignore
    expect(prepareOpenAIRequest(input)).toEqual(expected);
  });

  test('getFormattedChatMessages', async () => {
    const actual = await getFormattedChatMessages(1, 'Hello', false);

    const expected = [
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hi there!' },
    ];

    expect(actual).toEqual(expected);

    expect(operations.createNewAndReturnAllConversations).toHaveBeenCalledWith({
      chatId: 1,
      userQuery: 'Hello',
      role: 'user',
    });
    expect(operations.updateCurrentChat).toHaveBeenCalledWith({
      id: 1,
      data: {
        showLoader: true,
      },
    });
  });

  test('updateCurrentChatStatus', async () => {
    const removeQueryParameters = vi.fn();

    await updateCurrentChatStatus(1, true, removeQueryParameters);

    expect(removeQueryParameters).toHaveBeenCalled();
    expect(operations.updateCurrentChat).toHaveBeenCalledWith({
      id: 1,
      data: {
        smartSuggestions: { suggestions: [''], type: '' },
        userRespondedWithNextAction: true,
      },
    });
  });

  test('updateCurrentChatStatus', async () => {
    const removeQueryParameters = vi.fn();

    await updateCurrentChatStatus(1, false, removeQueryParameters);

    expect(removeQueryParameters).not.toHaveBeenCalled();
    expect(operations.updateCurrentChat).toHaveBeenCalledWith({
      id: 1,
      data: {
        smartSuggestions: { suggestions: [''], type: '' },
        userRespondedWithNextAction: false,
      },
    });
  });

  test('getInProgressConversation', async () => {
    const actual = await getInProgressConversation(1, 'Hello', false);

    const expected = {
      role: 'assistant',
      message: 'Hi there!',
      isLoading: true,
    };

    expect(actual).toEqual(expected);
    expect(operations.createNewAndReturnLastConversation).toHaveBeenCalledWith({
      chatId: 1,
      userQuery: 'Hello',
      role: 'assistant',
      isLoading: true,
    });
  });

  test('handleDailyAnalysisChat', async () => {
    const socket = {
      emit: vi.fn(),
    };
    const currentChatDetails = {
      chatType: 'daily_analysis',
      userId: 1,
      id: 2,
      team_name: 'team',
    };
    const inProgressConversation = {
      id: 3,
    };
    const userQuery = 'Hello';
    const messages: any[] = [];
    const activeChatId = 4;

    await handleDailyAnalysisChat(
      socket,
      currentChatDetails,
      inProgressConversation,
      userQuery,
      messages,
      activeChatId
    );

    expect(socket.emit).toHaveBeenCalledWith(
      'sendMessageToTeam',
      currentChatDetails,
      inProgressConversation.id,
      userQuery,
      messages,
      `default_team_${currentChatDetails.userId}_${currentChatDetails.id}`
    );
    expect(operations.updateCurrentChat).toHaveBeenCalledWith({
      id: activeChatId,
      data: {
        showLoader: false,
        team_status: 'inprogress',
      },
    });
  });

  test('handleDailyAnalysisChat', async () => {
    const socket = {
      emit: vi.fn(),
    };
    const currentChatDetails = {
      chatType: null,
      userId: 1,
      id: 2,
      team_name: 'some_other_team_1_2',
    };
    const inProgressConversation = {
      id: 3,
    };
    const userQuery = 'Hello';
    const messages: any[] = [];
    const activeChatId = 4;

    await handleDailyAnalysisChat(
      socket,
      currentChatDetails,
      inProgressConversation,
      userQuery,
      messages,
      activeChatId
    );

    expect(socket.emit).toHaveBeenCalledWith(
      'sendMessageToTeam',
      currentChatDetails,
      inProgressConversation.id,
      userQuery,
      messages,
      'some_other_team_1_2'
    );
    expect(operations.updateCurrentChat).toHaveBeenCalledWith({
      id: activeChatId,
      data: {
        showLoader: false,
        team_status: 'inprogress',
      },
    });
  });

  test('handleAgentResponse with customer_brief', async () => {
    const socket = { emit: vi.fn() };
    const response = {
      customer_brief: 'Hello',
      team_name: 'team',
      team_id: 1,
      team_status: 'inprogress',
      smart_suggestions: { suggestions: [''], type: '' },
      is_exception_occured: false,
    };
    const currentChatDetails = {};
    const inProgressConversation = { id: 1 };
    const messages: any[] = [];
    const activeChatId = 2;

    await handleAgentResponse(
      response,
      currentChatDetails,
      inProgressConversation,
      socket,
      messages,
      activeChatId
    );

    expect(socket.emit).toHaveBeenCalledWith(
      'sendMessageToTeam',
      currentChatDetails,
      inProgressConversation.id,
      response.customer_brief,
      messages,
      response.team_name
    );

    expect(operations.updateCurrentChat).toHaveBeenCalledWith({
      id: activeChatId,
      data: {
        showLoader: false,
        team_id: response.team_id,
        team_name: response.team_name,
        team_status: response.team_status,
        smartSuggestions: response.smart_suggestions,
        isExceptionOccured: response.is_exception_occured,
        customerBrief: response.customer_brief,
      },
    });
  });

  test('handleAgentResponse with content and no exception', async () => {
    const socket = { emit: vi.fn() };
    const response = {
      content: 'Hello',
      is_exception_occured: false,
      smart_suggestions: [],
      team_id: 1,
      team_status: 'inprogress',
      team_name: 'team',
      customer_brief: null,
    };
    const currentChatDetails = {};
    const inProgressConversation = { id: 1 };
    const messages: any[] = [];
    const activeChatId = 2;

    await handleAgentResponse(
      response,
      currentChatDetails,
      inProgressConversation,
      socket,
      messages,
      activeChatId
    );

    expect(socket.emit).toHaveBeenCalledWith(
      'checkSmartSuggestionStatus',
      activeChatId
    );
    expect(operations.updateCurrentChat).toHaveBeenCalledWith({
      id: activeChatId,
      data: {
        streamAgentResponse: true,
        showLoader: false,
        smartSuggestions: response.smart_suggestions,
      },
    });
    expect(operations.updateCurrentConversation).toHaveBeenCalledWith({
      id: inProgressConversation.id,
      data: {
        isLoading: false,
        message: response.content,
      },
    });
    expect(operations.updateCurrentChat).toHaveBeenCalledWith({
      id: activeChatId,
      data: {
        showLoader: false,
        team_id: response.team_id,
        team_name: response.team_name,
        team_status: response.team_status,
        smartSuggestions: response.smart_suggestions,
        isExceptionOccured: response.is_exception_occured,
        customerBrief: response.customer_brief,
      },
    });
  });

  test('handleAgentResponse with content', async () => {
    const socket = { emit: vi.fn() };
    const response = {
      content: 'Hello',
      team_id: 1,
      team_status: 'inprogress',
      team_name: 'team',
      customer_brief: null,
      is_exception_occured: false,
      smart_suggestions: [],
    };
    const currentChatDetails = {};
    const inProgressConversation = { id: 1 };
    const messages: any = [];
    const activeChatId = 2;

    await handleAgentResponse(
      response,
      currentChatDetails,
      inProgressConversation,
      socket,
      messages,
      activeChatId
    );

    expect(operations.updateCurrentConversation).toHaveBeenCalledWith({
      id: inProgressConversation.id,
      data: {
        isLoading: false,
        message: response.content,
      },
    });
    expect(operations.updateCurrentChat).toHaveBeenCalledWith({
      id: activeChatId,
      data: {
        showLoader: false,
        team_id: response.team_id,
        team_name: response.team_name,
        team_status: response.team_status,
        smartSuggestions: response.smart_suggestions,
        isExceptionOccured: response.is_exception_occured,
        customerBrief: response.customer_brief,
      },
    });
  });

  test('handleAgentResponse final updateCurrentChat call', async () => {
    const socket = { emit: vi.fn() };
    const response = {
      team_id: 1,
      team_name: 'team',
      team_status: 'status',
      smart_suggestions: [],
      is_exception_occured: false,
      customer_brief: 'Hello',
    };
    const currentChatDetails = {};
    const inProgressConversation = { id: 1 };
    const messages: any = [];
    const activeChatId = 2;

    await handleAgentResponse(
      response,
      currentChatDetails,
      inProgressConversation,
      socket,
      messages,
      activeChatId
    );

    expect(operations.updateCurrentChat).toHaveBeenCalledWith({
      id: activeChatId,
      data: {
        showLoader: false,
        team_id: response.team_id,
        team_name: response.team_name,
        team_status: response.team_status,
        smartSuggestions: response.smart_suggestions,
        isExceptionOccured: response.is_exception_occured,
        customerBrief: response.customer_brief,
      },
    });
  });
  test('handleChatError with No Subscription Found error', async () => {
    const err = new Error('No Subscription Found');
    const activeChatId = 1;
    const inProgressConversation = { id: 2 };
    const history = { push: vi.fn() };

    await handleChatError(err, activeChatId, inProgressConversation, history);

    expect(operations.updateCurrentChat).toHaveBeenCalledWith({
      id: activeChatId,
      data: { showLoader: false },
    });
    expect(history.push).toHaveBeenCalledWith('/pricing');
  });
  test('handleChatError with other error', async () => {
    const err = new Error('Other error');
    const activeChatId = 1;
    const inProgressConversation = { id: 2 };
    const history = { push: vi.fn() };

    await handleChatError(err, activeChatId, inProgressConversation, history);

    expect(operations.updateCurrentChat).toHaveBeenCalledWith({
      id: activeChatId,
      data: { showLoader: false },
    });
    expect(operations.updateCurrentConversation).toHaveBeenCalledWith({
      id: inProgressConversation.id,
      data: {
        isLoading: false,
        message: exceptionMessage,
      },
    });
    expect(operations.updateCurrentChat).toHaveBeenCalledWith({
      id: activeChatId,
      data: {
        showLoader: false,
        smartSuggestions: {
          suggestions: ["Let's try again"],
          type: 'oneOf',
        },
        isExceptionOccured: true,
      },
    });
  });
});
