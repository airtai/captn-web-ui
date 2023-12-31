import React from "react";
import { useLocation } from "react-router-dom";

export function areThereAnyTasks(): boolean {
  return true;
}

type InputMessage = {
  chatId: number;
  createdAt: string;
  id: number;
  message: string;
  previousConversationId: number | null;
  replyToConversationId: number | null;
  role: string;
  team_id: number | null;
  team_name: string | null;
  team_status: string | null;
  is_question_from_agent: boolean;
  updatedAt: string;
  userId: number;
};

type OutputMessage = {
  role: string;
  content: string;
};

function getLatestConversationID(input: InputMessage[]): number {
  const allMessageIDS: number[] = input.map((message) => message.id);
  const sortedAllMessageIDS = allMessageIDS.sort((a, b) => b - a);
  const latestConversationID = sortedAllMessageIDS[0];
  return latestConversationID;
}

export function prepareOpenAIRequest(input: InputMessage[]): OutputMessage[] {
  const messages: OutputMessage[] = input.map((message) => {
    return {
      role: message.role,
      content: message.message,
    };
  });
  return messages;
}

// A custom hook that builds on useLocation to parse
// the query string for you.
export function getQueryParam(paramName: string) {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]).get(
    paramName
  );
}
