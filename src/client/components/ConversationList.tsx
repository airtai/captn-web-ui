import React from "react";
import { useState } from "react";

import Markdown from "markdown-to-jsx";

import type { Conversation } from "@wasp/entities";
import AgentLoader from "./AgentLoader";
import SmartSuggestion from "./SmartSuggestion";
import logo from "../static/captn-logo.png";

type ConversationsListProps = {
  conversations: Conversation[];
  isLoading: boolean;
  smartSuggestions: any;
  smartSuggestionOnClick: any;
};

export default function ConversationsList({
  conversations,
  isLoading,
  smartSuggestions,
  smartSuggestionOnClick,
}: ConversationsListProps) {
  const isSmartSuggestionsAvailable =
    smartSuggestions?.length > 0 &&
    !(smartSuggestions.length === 1 && smartSuggestions[0] === "");
  return (
    <div data-testid="conversations-wrapper" className="w-full">
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

        return (
          <div key={idx}>
            <div
              style={{ minHeight: "85px" }}
              className={`flex items-center px-5 group bg-${conversationBgColor} flex-col`}
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
              </div>
            </div>
          </div>
        );
      })}
      {isLoading && <AgentLoader logo={logo} />}

      {isSmartSuggestionsAvailable && (
        <div data-testid="smart-suggestions">
          <SmartSuggestion
            suggestions={smartSuggestions}
            smartSuggestionOnClick={smartSuggestionOnClick}
          />
        </div>
      )}
    </div>
  );
}
