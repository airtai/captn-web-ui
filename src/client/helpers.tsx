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
  type: string | null;
  updatedAt: string;
  userId: number;
};

type OutputMessage = {
  role: string;
  content: string;
};

function getConvIDAndTeamDetails(
  input: InputMessage[]
): [number, number, boolean, number | null | undefined] {
  const allMessageIDS: number[] = input.map((message) => message.id);
  const sortedAllMessageIDS = allMessageIDS.sort((a, b) => b - a);
  const latestConversationID = sortedAllMessageIDS[0];
  const previousConversationID = sortedAllMessageIDS[1];
  const previousConversation = input.find(
    (message) => message.id === previousConversationID
  );
  const previousConversationTeamStatus = previousConversation?.team_status;
  const isAnswerToAgentQuestion = previousConversationTeamStatus == "pause";
  const userResponseToTeamId = previousConversation?.team_id;
  const previousConversationIdToClearStatus = previousConversationID;
  return [
    latestConversationID,
    previousConversationIdToClearStatus,
    isAnswerToAgentQuestion,
    userResponseToTeamId,
  ];
}

export function prepareOpenAIRequest(
  input: InputMessage[]
): [OutputMessage[], number, number, boolean, number | null | undefined] {
  const message: OutputMessage[] = input.map((message) => {
    return {
      role: message.role,
      content: message.message,
    };
  });
  const [
    latestConversationID,
    previousConversationIdToClearStatus,
    isAnswerToAgentQuestion,
    userResponseToTeamId,
  ] = getConvIDAndTeamDetails(input);
  return [
    message,
    latestConversationID,
    previousConversationIdToClearStatus,
    isAnswerToAgentQuestion,
    userResponseToTeamId,
  ];
}

// A custom hook that builds on useLocation to parse
// the query string for you.
export function getQueryParam(paramName: string) {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]).get(
    paramName
  );
}

export function setRedirectMsg(formInputRef: any, loginMsgQuery: string) {
  if (loginMsgQuery) {
    formInputRef.value = decodeURIComponent(loginMsgQuery);
  }
}

export function triggerSubmit(
  node: any,
  loginMsgQuery: string,
  formInputRef: any
) {
  if (loginMsgQuery && formInputRef && formInputRef.value !== "") {
    node.click();
  }
}
