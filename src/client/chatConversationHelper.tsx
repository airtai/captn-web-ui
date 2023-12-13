import getAgentResponse from "@wasp/actions/getAgentResponse";
import addNewConversationToChat from "@wasp/actions/addNewConversationToChat";
import updateExistingConversation from "@wasp/actions/updateExistingConversation";
import { prepareOpenAIRequest } from "./helpers";

export async function addUserMessageToConversation(
  chat_id: number,
  userQuery: string,
  conv_id?: number,
  team_name?: string,
  team_id?: number
) {
  let userMessage = userQuery;
  let isAnswerToAgentQuestion = false;
  let user_answer_to_team_id = null;
  if (team_id) {
    if (conv_id) {
      const payload = {
        chat_id: chat_id,
        conv_id: conv_id,
        is_question_from_agent: false,
        team_status: null,
      };
      await updateExistingConversation(payload);
    }
    userMessage = `<p>Replying to ${team_name}:</p><br/><br/>` + userQuery;
    isAnswerToAgentQuestion = true;
    user_answer_to_team_id = team_id;
  }

  const payload = {
    chat_id: chat_id,
    message: userMessage,
    role: "user",
  };

  const updatedConversation: any = await addNewConversationToChat(payload);

  const [messages, latestConversationID]: [
    messages: any,
    latestConversationID: number
  ] = prepareOpenAIRequest(updatedConversation);
  return [
    messages,
    latestConversationID,
    isAnswerToAgentQuestion,
    user_answer_to_team_id,
  ];
}

export async function addAgentMessageToConversation(
  chat_id: number,
  message: any,
  conv_id: number,
  isAnswerToAgentQuestion: boolean,
  userResponseToTeamId: number | null | undefined
) {
  const response: any = await getAgentResponse({
    chat_id: chat_id,
    message: message,
    conv_id: conv_id,
    isAnswerToAgentQuestion: isAnswerToAgentQuestion,
    userResponseToTeamId: userResponseToTeamId,
  });

  const openAIResponse = {
    chat_id: Number(chat_id),
    message: response.content,
    role: "assistant",
    ...(response.team_name && { team_name: response.team_name }),
    ...(response.team_id && { team_id: response.team_id }),
    ...(response.team_status && { team_status: response.team_status }),
  };
  return await addNewConversationToChat(openAIResponse);
}
