import React from "react";
import { useState, useCallback, useRef, useEffect } from "react";
import { useParams } from "react-router";
import { Redirect } from "react-router-dom";

import { useQuery } from "@wasp/queries";
import getConversations from "@wasp/queries/getConversations";
import getChat from "@wasp/queries/getChat";
import { useSocket, useSocketListener } from "@wasp/webSocket";
import updateExistingChat from "@wasp/actions/updateExistingChat";

import ConversationsList from "./ConversationList";
import Loader from "./Loader";

import {
  addUserMessageToConversation,
  addAgentMessageToConversation,
} from "../chatConversationHelper";

import { getQueryParam } from "../helpers";

export default function ConversationWrapper() {
  const { id }: { id: string } = useParams();
  const { socket, isConnected } = useSocket();
  const [isLoading, setIsLoading] = useState(false);
  const [formInputValue, setFormInputValue] = useState("");
  const chatWindowRef = useRef(null);
  const {
    data: currentChatDetails,
    refetch: refetchChat,
  }: { data: any; refetch: any } = useQuery(
    getChat,
    {
      chatId: Number(id),
    },
    { enabled: !!id }
  );
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(false);
  const { data: conversations, refetch } = useQuery(
    getConversations,
    {
      chatId: Number(id),
    },
    { enabled: !!id }
  );

  const googleRedirectLoginMsg: any = getQueryParam("msg");
  const formInputRef = useCallback(
    async (node: any) => {
      if (node !== null && googleRedirectLoginMsg) {
        await addMessagesToConversation(googleRedirectLoginMsg);
      }
    },
    [googleRedirectLoginMsg]
  );

  useEffect(() => {
    if (currentChatDetails) {
      setIsSubmitButtonDisabled(
        currentChatDetails.team_status === "inprogress" ||
          currentChatDetails.showLoader
      );
      setIsLoading(currentChatDetails.showLoader);
    }
  }, [currentChatDetails]);

  useSocketListener("newConversationAddedToDB", reFetchConversations);

  function reFetchConversations() {
    refetch();
    refetchChat();
  }

  useEffect(() => {
    setFormInputValue("");
  }, [id]);

  useEffect(() => {
    scrollToBottom();
    refetchChat();
  }, [conversations]);

  const scrollToBottom = () => {
    if (chatWindowRef.current) {
      // @ts-ignore
      chatWindowRef.current.scrollTo({
        // @ts-ignore
        top: chatWindowRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  async function addMessagesToConversation(userQuery: string) {
    try {
      const messages = await addUserMessageToConversation(
        Number(id),
        userQuery
      );
      // setIsLoading(true);
      await updateExistingChat({ chat_id: Number(id), showLoader: true });
      const teamId = googleRedirectLoginMsg
        ? Number(id)
        : // @ts-ignore
          currentChatDetails?.team_id;
      const response: any = await addAgentMessageToConversation(
        Number(id),
        messages,
        teamId
      );
      if (response.team_status === "inprogress") {
        // setIsSubmitButtonDisabled(true);
        socket.emit("newConversationAdded", response.chat_id);
      }

      // setIsLoading(false);
      await updateExistingChat({ chat_id: Number(id), showLoader: false });
    } catch (err: any) {
      // setIsLoading(false);
      await updateExistingChat({ chat_id: Number(id), showLoader: false });
      console.log("Error: " + err.message);
      window.alert("Error: Something went wrong. Please try again later.");
    }
  }

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.target as HTMLFormElement;
    const userQuery = target.userQuery.value;
    // target.reset();
    setFormInputValue("");
    await addMessagesToConversation(userQuery);
  };

  const chatContainerClass = `flex h-full flex-col items-center justify-between overflow-y-auto bg-captn-light-blue ${
    isLoading ? "opacity-40" : "opacity-100"
  }`;

  // check if user has access to chat
  if (conversations && conversations.length === 0) {
    return (
      <>
        <Redirect to="/chat" />
      </>
    );
  }

  return (
    <div className="relative flex h-full max-w-full flex-1 flex-col overflow-hidden bg-captn-light-blue">
      <div className="relative h-full w-full flex-1 overflow-auto transition-width">
        <div className="flex h-full flex-col">
          <div className="flex-1 overflow-hidden pb-36">
            <div ref={chatWindowRef} className={`${chatContainerClass}`}>
              {conversations && (
                <ConversationsList conversations={conversations} />
              )}
            </div>
            {isLoading && <Loader />}
            {id ? (
              <div className="w-full absolute left-0 right-0 bottom-20 w-full">
                <form onSubmit={handleFormSubmit} className="">
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
                      placeholder="Send a message"
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
                      } absolute right-2 font-medium rounded-lg text-sm px-3 py-1.5`}
                      disabled={isSubmitButtonDisabled}
                    >
                      Send
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <p
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl md:text-6xl text-captn-light-cream opacity-70"
                style={{ lineHeight: "normal" }}
              >
                Please initiate a new chat or select existing chats to resume
                your conversation.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
