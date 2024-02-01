import { useParams } from "react-router";
import { useState } from "react";
import { useQuery } from "@wasp/queries";
import { useHistory } from "react-router-dom";

import getChats from "@wasp/queries/getChats";
import getChat from "@wasp/queries/getChat";
import type { User } from "@wasp/entities";
import { useSocket, useSocketListener } from "@wasp/webSocket";

import CreateNewChatBtn from "./components/CreateNewChat";
import ChatsList from "./components/ChatList";
import ConversationWrapper from "./components/ConversationWrapper";
import { getQueryParam } from "./helpers";

function DefaultMessage() {
  return (
    <p
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl md:text-6xl text-captn-light-cream opacity-70"
      style={{ lineHeight: "normal" }}
    >
      Please initiate a new chat or select existing chats to resume your
      conversation.
    </p>
  );
}

export default function ChatPage({ user }: { user: User }) {
  const history = useHistory();
  const { data: chats, isLoading: isLoadingChats } = useQuery(getChats);
  const { id: chatId }: { id: string } = useParams();
  let googleRedirectLoginMsg: any = getQueryParam("msg");
  const userSelectedAction: any = getQueryParam("selected_user_action");
  const [agentMessages, setAgentMessages] = useState("");
  const {
    data: currentChatDetails,
    refetch: refetchChat,
  }: { data: any; refetch: any } = useQuery(
    getChat,
    { chatId: Number(chatId) },
    { enabled: !!chatId }
  );

  let userSelectedActionMessage: string | null = null;

  if (userSelectedAction) {
    if (!currentChatDetails?.userRespondedWithNextAction) {
      if (currentChatDetails?.proposedUserAction) {
        userSelectedActionMessage =
          currentChatDetails.proposedUserAction[Number(userSelectedAction) - 1];
      }
    }
  }

  if (googleRedirectLoginMsg) {
    if (currentChatDetails?.userRespondedWithNextAction) {
      googleRedirectLoginMsg = null;
    }
  }

  if (user) {
    if (!user.hasPaid) {
      history.push("/pricing");
    }
  }
  useSocketListener("messageFromAgent", updateState);
  function updateState(msg: string) {
    setAgentMessages(agentMessages + msg);
  }

  return (
    <div className="relative z-0 flex h-full w-full overflow-hidden h-screen">
      <div
        id="default-sidebar"
        className="md:w-[260px] flex-shrink-0 overflow-x-hidden dark bg-captn-dark-blue"
        aria-label="Sidebar"
      >
        <div
          style={{ borderRight: "1px solid #eae4d9" }}
          className="border-x-captn-light-cream h-full px-3 py-4 overflow-y-auto bg-captn-dark-blue"
        >
          <CreateNewChatBtn />
          <div className="flex-col flex-1 transition-opacity duration-500 -mr-2 pr-2 overflow-y-auto">
            <ul className="py-5 space-y-2 font-medium">
              {
                // Todo: remove the below ignore comment
                // @ts-ignore
                chats && <ChatsList chats={chats} />
              }
            </ul>
          </div>
        </div>
      </div>
      <div className="relative z-0 flex h-full w-full overflow-hidden h-screen bg-captn-light-blue">
        {chatId && currentChatDetails ? (
          <ConversationWrapper
            chatId={Number(chatId)}
            currentChatDetails={currentChatDetails}
            refetchChat={refetchChat}
            googleRedirectLoginMsg={googleRedirectLoginMsg}
            // @ts-ignore
            userSelectedActionMessage={userSelectedActionMessage}
          />
        ) : (
          <DefaultMessage />
        )}
      </div>
      {/* <div className="md:w-[260px] flex-shrink-0 overflow-x-hidden dark bg-captn-dark-blue">
        <div
          style={{ borderLeft: "1px solid #eae4d9" }}
          className="border-x-captn-light-cream h-full px-3 py-4 overflow-y-auto bg-captn-dark-blue"
        >
          <p className="text-white break-words">{agentMessages}</p>
        </div>
      </div> */}
    </div>
  );
}
