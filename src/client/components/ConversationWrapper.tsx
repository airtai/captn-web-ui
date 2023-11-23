import React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { useParams } from "react-router";
import { Redirect, useLocation } from "react-router-dom";

import { useQuery } from "@wasp/queries";
import updateConversation from "@wasp/actions/updateConversation";
import getAgentResponse from "@wasp/actions/getAgentResponse";
import getConversations from "@wasp/queries/getConversations";

import ConversationsList from "./ConversationList";
import Loader from "./Loader";

// A custom hook that builds on useLocation to parse
// the query string for you.
function getQueryParam(paramName: string) {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]).get(
    paramName
  );
}

export function setRedirectMsg(formInputRef: any, loginMsgQuery: string) {
  if (loginMsgQuery) {
    formInputRef.value = decodeURIComponent(loginMsgQuery);
  }
}

export function triggerSubmit(
  node: any,
  loginMsgQuery: string,
  formInputRef: any
) {
  if (loginMsgQuery && formInputRef && formInputRef.value !== "") {
    node.click();
  }
}

export default function ConversationWrapper() {
  // Todo: remove the below ignore comment
  // @ts-ignore
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);

  const loginMsgQuery: any = getQueryParam("msg");
  const formInputRef = useCallback(
    (node: any) => {
      if (node !== null) {
        setRedirectMsg(node, loginMsgQuery);
      }
    },
    [loginMsgQuery]
  );

  const submitBtnRef = useCallback(
    (node: any) => {
      if (node !== null) {
        triggerSubmit(node, loginMsgQuery, formInputRef);
      }
    },
    [loginMsgQuery, formInputRef]
  );

  const {
    data: conversations,
    isLoading: isConversationLoading,
    error: isConversationError,
  } = useQuery(
    getConversations,
    {
      chatId: Number(id),
    },
    { enabled: !!id }
  );

  useEffect(() => {
    if (chatContainerRef.current) {
      // Todo: remove the below ignore comment
      // @ts-ignore
      chatContainerRef.current.scrollTop =
        // Todo: remove the below ignore comment
        // @ts-ignore
        chatContainerRef.current.scrollHeight;
    }
  }, [conversations]);

  async function callAgent(userQuery: string) {
    try {
      // 1. add new conversation to table
      const payload = {
        conversation_id: conversations.id,
        conversations: [
          // Todo: remove the below ignore comment
          // @ts-ignore
          ...conversations.conversation,
          ...[{ role: "user", content: userQuery }],
        ],
      };

      await updateConversation(payload);
      // 2. call backend python server to get agent response
      setIsLoading(true);
      const response = await getAgentResponse({
        message: payload.conversations,
        conv_id: payload.conversation_id,
      });
      // 3. add agent response as new conversation in the table
      const openAIPayload = {
        conversation_id: conversations.id,
        conversations: [
          ...payload.conversations,
          // Todo: remove the below ignore comment
          // @ts-ignore
          ...[{ role: "assistant", content: response.content }],
        ],
        status: response.team_status,
      };
      await updateConversation(openAIPayload);
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      window.alert("Error: " + err.message);
    }
  }

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.target;
    // Todo: remove the below ignore comment
    // @ts-ignore
    const userQuery = target.userQuery.value;
    // Todo: remove the below ignore comment
    // @ts-ignore
    target.reset();
    callAgent(userQuery);
  };

  if (isConversationLoading && !!id) return <Loader />;
  if (isConversationError) {
    return (
      <>
        <Redirect to="/chat" />
      </>
    );
  }

  const chatContainerClass = `flex h-full flex-col items-center justify-between pb-24 overflow-y-auto bg-captn-light-blue ${
    isLoading ? "opacity-40" : "opacity-100"
  }`;

  return (
    <div className="relative flex h-full max-w-full flex-1 flex-col overflow-hidden bg-captn-light-blue">
      <div className="relative h-full w-full flex-1 overflow-auto transition-width">
        <div className="flex h-full flex-col">
          <div className="flex-1 overflow-hidden">
            <div
              ref={chatContainerRef}
              className={`${chatContainerClass}`}
              style={{ height: "85%" }}
            >
              {conversations && (
                // Todo: remove the below ignore comment
                // @ts-ignore
                <ConversationsList conversations={conversations.conversation} />
              )}
            </div>
            {isLoading && <Loader />}
            {id ? (
              <div className="w-full pt-0 md:pt-2 md:pt-0 border-t md:border-t-0 dark:border-white/20 md:border-transparent md:dark:border-transparent md:pl-2 gizmo:pl-0 gizmo:md:pl-0 md:w-[calc(100%-.5rem)] absolute bottom-100 left-0 md:bg-vert-light-gradient bg-white dark:bg-gray-800 md:!bg-transparent dark:md:bg-vert-dark-gradient">
                <form onSubmit={handleFormSubmit} className="">
                  <label
                    htmlFor="search"
                    className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                  >
                    Search
                  </label>
                  <div className="relative">
                    <input
                      type="search"
                      id="userQuery"
                      name="search"
                      className="block w-full p-4 pl-5 text-sm text-captn-light-cream border border-gray-300 rounded-lg bg-captn-dark-blue focus:ring-blue-500 focus:border-blue-500 dark:bg-captn-dark-blue dark:border-gray-600 dark:placeholder-gray-400 dark:text-captn-light-cream dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Send a message"
                      required
                      ref={formInputRef}
                    />
                    <button
                      ref={submitBtnRef}
                      type="submit"
                      className="text-white absolute right-2.5 bottom-2.5 bg-captn-cta-green hover:bg-captn-cta-green-hover focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-captn-cta-green dark:hover:bg-captn-cta-green-hover dark:focus:ring-blue-800"
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
