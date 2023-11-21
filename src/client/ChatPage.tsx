import { useQuery } from "@wasp/queries";
import getChats from "@wasp/queries/getChats";

import CreateNewChatBtn from "./components/CreateNewChat";
import ChatsList from "./components/ChatList";
import ConversationWrapper from "./components/ConversationWrapper";

export default function ChatPage() {
  let { data: chats, isLoading: isLoadingChats } = useQuery(getChats);

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
        <ConversationWrapper />
      </div>
    </div>
  );
}
