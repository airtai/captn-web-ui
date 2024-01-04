import { test, expect } from "vitest";

import { areThereAnyTasks, prepareOpenAIRequest } from "../helpers";

test("areThereAnyTasks", () => {
  expect(areThereAnyTasks()).toBe(true);
});

test("prepareOpenAIRequest_1", () => {
  const input = [
    {
      chatId: 4,
      createdAt: "Wed Nov 29 2023 06:37:27 GMT+0530 (India Standard Time)",
      id: 8,
      message: "First Message",
      previousConversationId: null,
      replyToConversationId: null,
      role: "user",
      team_id: null,
      team_name: null,
      team_status: null,
      is_question_from_agent: false,
      updatedAt: "Wed Nov 29 2023 06:37:27 GMT+0530 (India Standard Time)",
      userId: 1,
    },
    {
      chatId: 4,
      createdAt: "Wed Nov 29 2023 06:37:27 GMT+0530 (India Standard Time)",
      id: 9,
      message: "Second Message",
      previousConversationId: null,
      replyToConversationId: null,
      role: "user",
      team_id: null,
      team_name: null,
      team_status: null,
      is_question_from_agent: false,
      updatedAt: "Wed Nov 29 2023 06:37:27 GMT+0530 (India Standard Time)",
      userId: 1,
    },
  ];
  const expected_message = [
    {
      role: "user",
      content: "First Message",
    },
    {
      role: "user",
      content: "Second Message",
    },
  ];
  const actual_message = prepareOpenAIRequest(input);
  expect(actual_message).toStrictEqual(expected_message);
});

test("prepareOpenAIRequest_2", () => {
  const input = [
    {
      chatId: 4,
      createdAt: "Wed Nov 29 2023 06:37:27 GMT+0530 (India Standard Time)",
      id: 8,
      message: "First Message",
      previousConversationId: null,
      replyToConversationId: null,
      role: "user",
      team_id: null,
      team_name: null,
      team_status: null,
      is_question_from_agent: false,
      updatedAt: "Wed Nov 29 2023 06:37:27 GMT+0530 (India Standard Time)",
      userId: 1,
    },
  ];
  const expected_message = [
    {
      role: "user",
      content: "First Message",
    },
  ];

  const actual_message = prepareOpenAIRequest(input);
  expect(actual_message).toStrictEqual(expected_message);
});

test("prepareOpenAIRequest_3", () => {
  const input = [
    {
      chatId: 4,
      createdAt: "Wed Nov 29 2023 06:37:27 GMT+0530 (India Standard Time)",
      id: 1,
      message: "First Message",
      previousConversationId: null,
      replyToConversationId: null,
      role: "assistant",
      team_id: null,
      team_name: null,
      team_status: null,
      is_question_from_agent: false,
      updatedAt: "Wed Nov 29 2023 06:37:27 GMT+0530 (India Standard Time)",
      userId: 1,
    },
    {
      chatId: 4,
      createdAt: "Wed Nov 29 2023 06:37:27 GMT+0530 (India Standard Time)",
      id: 2,
      message: "Second Message",
      previousConversationId: null,
      replyToConversationId: null,
      role: "user",
      team_id: null,
      team_name: null,
      team_status: null,
      is_question_from_agent: false,
      updatedAt: "Wed Nov 29 2023 06:37:27 GMT+0530 (India Standard Time)",
      userId: 1,
    },
    {
      chatId: 4,
      createdAt: "Wed Nov 29 2023 06:37:27 GMT+0530 (India Standard Time)",
      id: 10,
      message: "Third Message",
      previousConversationId: null,
      replyToConversationId: null,
      role: "assistant",
      team_id: 123,
      team_name: "google_ads_agent",
      team_status: "pause",
      is_question_from_agent: true,
      updatedAt: "Wed Nov 29 2023 06:37:27 GMT+0530 (India Standard Time)",
      userId: 1,
    },
    {
      chatId: 4,
      createdAt: "Wed Nov 29 2023 06:37:27 GMT+0530 (India Standard Time)",
      id: 22,
      message: "Forth Message",
      previousConversationId: null,
      replyToConversationId: null,
      role: "user",
      team_id: null,
      team_name: null,
      team_status: null,
      is_question_from_agent: false,
      updatedAt: "Wed Nov 29 2023 06:37:27 GMT+0530 (India Standard Time)",
      userId: 1,
    },
  ];
  const expected_message = [
    {
      role: "assistant",
      content: "First Message",
    },
    {
      role: "user",
      content: "Second Message",
    },
    {
      role: "assistant",
      content: "Third Message",
    },
    {
      role: "user",
      content: "Forth Message",
    },
  ];
  const actual_message = prepareOpenAIRequest(input);
  expect(actual_message).toStrictEqual(expected_message);
});
