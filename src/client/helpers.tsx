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

function getConvIDAndTeamStatus(input: InputMessage[]): [number, boolean] {
  const allMessageIDS: number[] = input.map((message) => message.id);
  const sortedAllMessageIDS = allMessageIDS.sort((a, b) => b - a);
  const latestConversationID = sortedAllMessageIDS[0];
  const previousConversationID = sortedAllMessageIDS[1];
  const previousConversationTeamStatus = input.find(
    (message) => message.id === previousConversationID
  )?.team_status;
  const is_answer_to_agent_question = previousConversationTeamStatus == "pause";
  return [latestConversationID, is_answer_to_agent_question];
}

export function prepareOpenAIRequest(
  input: InputMessage[]
): [OutputMessage[], number, boolean] {
  const message: OutputMessage[] = input.map((message) => {
    return {
      role: message.role,
      content: message.message,
    };
  });
  const [latestConversationID, is_answer_to_agent_question] =
    getConvIDAndTeamStatus(input);
  return [message, latestConversationID, is_answer_to_agent_question];
}
