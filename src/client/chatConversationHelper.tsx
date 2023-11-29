import getAgentResponse from "@wasp/actions/getAgentResponse";
import addNewConversationToChat from "@wasp/actions/addNewConversationToChat";
import { prepareOpenAIRequest } from "./helpers";

export async function addUserMessageToConversation(
  chat_id: number,
  userQuery: string
) {
  const payload = {
    chat_id: chat_id,
    message: userQuery,
    role: "user",
  };

  const updatedConversation: any = await addNewConversationToChat(payload);
  const [message, conv_id, is_answer_to_agent_question]: [
    message: any,
    conv_id: number,
    is_answer_to_agent_question: boolean
  ] = prepareOpenAIRequest(updatedConversation);
  return [message, conv_id, is_answer_to_agent_question];
}

export async function addAgentMessageToConversation(
  chat_id: number,
  message: any,
  conv_id: number,
  is_answer_to_agent_question: boolean
) {
  const response: any = await getAgentResponse({
    message: message,
    conv_id: conv_id,
    is_answer_to_agent_question: is_answer_to_agent_question,
  });
  const openAIResponse = {
    chat_id: Number(chat_id),
    message: response.content,
    role: "assistant",
    ...(response.team_name && { team_name: response.team_name }),
    ...(response.team_id && { team_id: response.team_id }),
    ...(response.team_status && { team_status: response.team_status }),
  };
  await addNewConversationToChat(openAIResponse);
}
