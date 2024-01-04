import { useParams } from "react-router";
import { useQuery } from "@wasp/queries";

import getChats from "@wasp/queries/getChats";
import getChat from "@wasp/queries/getChat";

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

export default function ChatPage() {
  const { data: chats, isLoading: isLoadingChats } = useQuery(getChats);
  const { id: chatId }: { id: string } = useParams();
  const googleRedirectLoginMsg: any = getQueryParam("msg");
  const {
    data: currentChatDetails,
    refetch: refetchChat,
  }: { data: any; refetch: any } = useQuery(
    getChat,
    { chatId: Number(chatId) },
    { enabled: !!chatId }
  );

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
          />
        ) : (
          <DefaultMessage />
        )}
      </div>
    </div>
  );
}
