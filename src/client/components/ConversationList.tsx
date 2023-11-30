import React from "react";
import { useState } from "react";

import Markdown from "markdown-to-jsx";

import type { Conversation } from "@wasp/entities";

import logo from "../static/captn-logo.png";

type ConversationsListProps = {
  conversations: Conversation[];
  onInlineFormSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export default function ConversationsList({
  conversations,
  onInlineFormSubmit,
}: ConversationsListProps) {
  return (
    <div className="w-full">
      {conversations.map((conversation, idx) => {
        const conversationBgColor =
          conversation.role === "user" ? "captn-light-blue" : "captn-dark-blue";
        const conversationTextColor =
          conversation.role === "user"
            ? "captn-dark-blue"
            : "captn-light-cream";
        const conversationLogo =
          conversation.role === "user" ? (
            <div
              style={{
                alignItems: "center",
                background: "#fff",
                borderRadius: "50%",
                color: "#444654",
                display: "flex",
                flexBasis: "40px",
                flexGrow: "0",
                flexShrink: "0",
                fontSize: "14px",
                height: "40px",
                justifyContent: "center",
                padding: "5px",
                position: "relative",
                width: "40px",
              }}
              className="flex"
            >
              <div>You</div>
            </div>
          ) : (
            <img
              alt="captn logo"
              src={logo}
              className="w-full h-full"
              style={{ borderRadius: "50%" }}
            />
          );

        const handleFormSubmit = (
          event: React.FormEvent<HTMLFormElement>,
          conv_id: number,
          team_name: string,
          team_id: number
        ) => {
          event.preventDefault();
          const target = event.target as HTMLFormElement;
          const userQuery = target.userQuery.value;
          target.reset();
          onInlineFormSubmit(userQuery, conv_id, team_name, team_id);
        };
        const displayInlineForm = conversation.type === "agent_question";
        return (
          <div key={idx}>
            <div
              style={{ minHeight: "85px" }}
              className={`flex items-center px-5 py-2 group bg-${conversationBgColor} flex-col`}
            >
              <div
                style={{ maxWidth: "840px", margin: "auto" }}
                className={`relative ml-3 block w-full p-4 pl-10 text-sm text-${conversationTextColor}  border-${conversationBgColor} rounded-lg bg-${conversationBgColor} `}
              >
                <span
                  className="absolute inline-block"
                  style={{
                    left: "-15px",
                    top: "6px",
                    height: " 45px",
                    width: "45px",
                  }}
                >
                  {conversationLogo}
                </span>
                <div className="chat-conversations text-base flex flex-col gap-2">
                  <Markdown>{conversation.message}</Markdown>
                </div>
                {displayInlineForm && (
                  <form
                    key={conversation.id}
                    // onSubmit={handleFormSubmit}
                    onSubmit={(event) =>
                      handleFormSubmit(
                        event,
                        conversation.id,
                        conversation.team_name,
                        conversation.team_id
                      )
                    }
                    className="relative block w-full mt-[15px]"
                  >
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
                        className="block w-full p-4 pl-5 text-sm text-captn-dark-blue border border-gray-300 rounded-lg bg-gray-300 focus:ring-blue-500 focus:border-blue-500 placeholder-captn-dark-blue"
                        placeholder="Reply"
                        required
                      />
                      <button
                        type="submit"
                        className="text-white absolute right-2.5 bottom-2.5 bg-captn-cta-green hover:bg-captn-cta-green-hover focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
                      >
                        Send
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
