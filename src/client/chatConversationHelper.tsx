import getAgentResponse from "@wasp/actions/getAgentResponse";
import addNewConversationToChat from "@wasp/actions/addNewConversationToChat";
import updateExistingChat from "@wasp/actions/updateExistingChat";
import getSmartSuggestion from "@wasp/actions/getSmartSuggestion";
import { prepareOpenAIRequest } from "./helpers";

export async function addUserMessageToConversation(
  chat_id: number,
  userQuery: string
) {
  let userMessage = userQuery;
  const payload = {
    chat_id: chat_id,
    message: userMessage,
    role: "user",
  };
  const updatedConversation: any = await addNewConversationToChat(payload);
  const messages: any = prepareOpenAIRequest(updatedConversation);
  return messages;
}

export async function addAgentMessageToConversation(
  chat_id: number,
  message: any,
  team_id: number | null | undefined
) {
  const response: any = await getAgentResponse({
    chat_id: chat_id,
    message: message,
    team_id: team_id,
  });

  // ...(response.team_name && { team_name: response.team_name }),
  //   ...(response.team_id && { team_id: response.team_id }),
  //   ...(response.team_status && { team_status: response.team_status }),

  if (response.team_name) {
    const payload = {
      chat_id: chat_id,
      team_name: response.team_name,
      team_id: response.team_id,
      team_status: response.team_status,
    };
    await updateExistingChat(payload);
  }

  if (response.content) {
    const openAIResponse = {
      chat_id: Number(chat_id),
      message: response.content,
      role: "assistant",
    };

    if (response && !response.team_name) {
      const suggestions: any = await getSmartSuggestion({
        content: response.content,
      });
      const payload = {
        chat_id: Number(chat_id),
        smartSuggestions: suggestions,
      };
      await updateExistingChat(payload);
    }
    await addNewConversationToChat(openAIResponse);
  }

  return {
    chat_id: Number(chat_id),
    ...(response.team_name && { team_name: response.team_name }),
    ...(response.team_id && { team_id: response.team_id }),
    ...(response.team_status && { team_status: response.team_status }),
  };
}
