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
      type: null,
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
      type: null,
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
  const expected_conv_id = 9;
  const expected_is_answer_to_agent_question = false;

  const [actual_message, actual_conv_id, actual_is_answer_to_agent_question] =
    prepareOpenAIRequest(input);
  expect(actual_message).toStrictEqual(expected_message);
  expect(actual_conv_id).toStrictEqual(expected_conv_id);
  expect(actual_is_answer_to_agent_question).toStrictEqual(
    expected_is_answer_to_agent_question
  );
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
      type: null,
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
  const expected_conv_id = 8;
  const expected_is_answer_to_agent_question = false;

  const [actual_message, actual_conv_id, actual_is_answer_to_agent_question] =
    prepareOpenAIRequest(input);
  expect(actual_message).toStrictEqual(expected_message);
  expect(actual_conv_id).toStrictEqual(expected_conv_id);
  expect(actual_is_answer_to_agent_question).toStrictEqual(
    expected_is_answer_to_agent_question
  );
});

test("prepareOpenAIRequest_1", () => {
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
      type: null,
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
      type: null,
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
      type: "agent",
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
      type: null,
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
  const expected_conv_id = 22;
  const expected_is_answer_to_agent_question = true;

  const [actual_message, actual_conv_id, actual_is_answer_to_agent_question] =
    prepareOpenAIRequest(input);
  expect(actual_message).toStrictEqual(expected_message);
  expect(actual_conv_id).toStrictEqual(expected_conv_id);
  expect(actual_is_answer_to_agent_question).toStrictEqual(
    expected_is_answer_to_agent_question
  );
});
