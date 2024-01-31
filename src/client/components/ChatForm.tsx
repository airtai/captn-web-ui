import React, { useRef, useState, useEffect, useCallback } from "react";

import updateExistingChat from "@wasp/actions/updateExistingChat";

export default function ChatFrom({
  handleFormSubmit,
  isSubmitButtonDisabled,
  chatId,
  googleRedirectLoginMsg,
  userSelectedActionMessage,
  addMessagesToConversation,
}: {
  handleFormSubmit: any;
  isSubmitButtonDisabled: boolean;
  chatId: number;
  googleRedirectLoginMsg: string;
  userSelectedActionMessage: string;
  addMessagesToConversation: any;
}) {
  const [formInputValue, setFormInputValue] = useState("");
  const formInputRef = useCallback(
    async (node: any) => {
      if (node !== null && googleRedirectLoginMsg) {
        await addMessagesToConversation(googleRedirectLoginMsg);
        const payload = {
          chat_id: chatId,
          userRespondedWithNextAction: true,
        };
        await updateExistingChat(payload);
      }
      if (node !== null && userSelectedActionMessage) {
        await addMessagesToConversation(userSelectedActionMessage);
        const payload = {
          chat_id: chatId,
          userRespondedWithNextAction: true,
        };
        await updateExistingChat(payload);
      }
    },
    [googleRedirectLoginMsg, userSelectedActionMessage]
  );

  useEffect(() => {
    setFormInputValue("");
  }, [chatId]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.target as HTMLFormElement;
    const userQuery = target.userQuery.value;
    setFormInputValue("");
    handleFormSubmit(userQuery);
  };

  return (
    <div
      data-testid="chat-form"
      className="w-full absolute left-0 right-0 bottom-20 w-full"
    >
      <form onSubmit={handleSubmit} className="">
        <label
          htmlFor="search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Search
        </label>
        <div className="relative bottom-0 left-0 right-0 flex items-center justify-between m-1">
          <input
            type="search"
            id="userQuery"
            name="search"
            className="block rounded-lg w-full h-12 text-sm text-captn-light-cream bg-captn-dark-blue focus:ring-blue-500 focus:border-blue-500"
            placeholder="Message CaptnAI..."
            required
            ref={formInputRef}
            value={formInputValue}
            onChange={(e) => setFormInputValue(e.target.value)}
          />
          <button
            type="submit"
            className={`text-white ${
              isSubmitButtonDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-captn-cta-green hover:bg-captn-cta-green-hover focus:ring-4 focus:outline-none focus:ring-blue-300"
            } absolute right-2 font-medium rounded-lg text-sm px-1.5 py-1.5`}
            disabled={isSubmitButtonDisabled}
          >
            <span className="">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="text-captn-light-cream"
              >
                <path
                  d="M7 11L12 6L17 11M12 18V7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
