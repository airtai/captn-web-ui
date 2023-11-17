import { useHistory } from "react-router-dom";

import createChat from "@wasp/actions/createChat";

export default function CreateNewChatBtn() {
  const history = useHistory();

  const handleClick = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): Promise<void> => {
    event.preventDefault();
    try {
      const newChatConversations = await createChat();
      history.push(`/chat/${newChatConversations.chatId}`);
    } catch (err: any) {
      window.alert("Error: " + err.message);
    }
  };
  return (
    <div className="mb-1 flex flex-row gap-2">
      <button
        onClick={handleClick}
        className="flex px-3 min-h-[44px] py-1 items-center gap-3 transition-colors duration-200 dark:text-white cursor-pointer text-sm rounded-md rounded-md text-white bg-captn-cta-green hover:bg-captn-cta-green-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex-grow overflow-hidden"
      >
        <svg
          stroke="currentColor"
          fill="none"
          strokeWidth="2"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="icon-sm shrink-0"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        <span className="m-0 p-0 md:hidden">New</span>
        <span className="m-0 p-0 hidden md:inline-block">New chat</span>
      </button>
    </div>
  );
}
