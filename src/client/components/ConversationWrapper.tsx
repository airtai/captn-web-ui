import React from "react";
import { useState, useRef, useEffect } from "react";
import { Redirect } from "react-router-dom";

import { useQuery } from "@wasp/queries";
import getConversations from "@wasp/queries/getConversations";
import { useSocket, useSocketListener } from "@wasp/webSocket";
import updateExistingChat from "@wasp/actions/updateExistingChat";

import ConversationsList from "./ConversationList";
import Loader from "./Loader";
import ChatForm from "./ChatForm";

import {
  addUserMessageToConversation,
  addAgentMessageToConversation,
} from "../chatConversationHelper";

export default function ConversationWrapper({
  chatId,
  currentChatDetails,
  refetchChat,
  googleRedirectLoginMsg,
}: {
  chatId: number;
  currentChatDetails: any;
  refetchChat: any;
  googleRedirectLoginMsg: string;
}) {
  const { socket } = useSocket();
  const [isLoading, setIsLoading] = useState(false);
  let previousConversationsLength = useRef(0);
  let previousChatDetailsRef = useRef<{ team_status: string } | null>(null);
  const conversationWindowRef = useRef(null);
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(false);
  const { data: conversations, refetch: refetchConversation } = useQuery(
    getConversations,
    {
      chatId: Number(chatId),
    }
  );

  useEffect(() => {
    setIsSubmitButtonDisabled(
      currentChatDetails.team_status === "inprogress" ||
        currentChatDetails.showLoader
    );
    setIsLoading(currentChatDetails.showLoader);
    if (
      currentChatDetails.team_status === "inprogress" &&
      previousChatDetailsRef.current &&
      previousChatDetailsRef.current.team_status !== "inprogress"
    ) {
      scrollToBottom();
    }
    previousChatDetailsRef.current = currentChatDetails;
  }, [currentChatDetails]);

  useEffect(() => {
    scrollToBottom();
  }, [currentChatDetails?.smartSuggestions]);

  useSocketListener("newConversationAddedToDB", updateState);

  function updateState() {
    refetchConversation();
    refetchChat();
  }

  useEffect(() => {
    if (conversations) {
      if (conversations.length !== previousConversationsLength.current) {
        scrollToBottom();
        refetchChat();
      }
      previousConversationsLength.current = conversations.length;
    }
  }, [conversations]);

  const scrollToBottom = () => {
    if (conversationWindowRef.current) {
      // @ts-ignore
      conversationWindowRef.current.scrollTo({
        // @ts-ignore
        top: conversationWindowRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  async function addMessagesToConversation(userQuery: string) {
    try {
      const messages = await addUserMessageToConversation(
        Number(chatId),
        userQuery
      );
      // setIsLoading(true);
      await updateExistingChat({ chat_id: Number(chatId), showLoader: true });
      const teamId = googleRedirectLoginMsg
        ? Number(chatId)
        : currentChatDetails.team_id;
      const response: any = await addAgentMessageToConversation(
        Number(chatId),
        messages,
        teamId
      );
      if (response.team_status === "inprogress") {
        // setIsSubmitButtonDisabled(true);
        socket.emit("newConversationAdded", response.chat_id);
      }

      // setIsLoading(false);
      await updateExistingChat({ chat_id: Number(chatId), showLoader: false });
    } catch (err: any) {
      // setIsLoading(false);
      await updateExistingChat({ chat_id: Number(chatId), showLoader: false });
      console.log("Error: " + err.message);
      window.alert("Error: Something went wrong. Please try again later.");
    }
  }

  const handleFormSubmit = async (userQuery: string) => {
    await updateExistingChat({ chat_id: Number(chatId), smartSuggestions: [] });
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
            <div
              ref={conversationWindowRef}
              className={`${chatContainerClass}`}
            >
              {conversations && (
                <ConversationsList
                  conversations={conversations}
                  isLoading={currentChatDetails.team_status === "inprogress"}
                  smartSuggestions={currentChatDetails.smartSuggestions}
                  smartSuggestionOnClick={handleFormSubmit}
                />
              )}
            </div>
            {isLoading && <Loader />}
            <ChatForm
              handleFormSubmit={handleFormSubmit}
              isSubmitButtonDisabled={isSubmitButtonDisabled}
              chatId={chatId}
              googleRedirectLoginMsg={googleRedirectLoginMsg}
              addMessagesToConversation={addMessagesToConversation}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
