import React from "react";
import { useState, useEffect } from "react";

import Markdown from "markdown-to-jsx";

import type { Conversation } from "@wasp/entities";
import { useSocketListener } from "@wasp/webSocket";
import updateExistingConversation from "@wasp/actions/updateExistingConversation";

import AgentLoader from "./AgentLoader";
import SmartSuggestionButton from "./SmartSuggestionButton";
import SmartSuggestionCheckbox from "./SmartSuggestionCheckbox";
import logo from "../static/captn-logo.png";

type ConversationsListProps = {
  conversations: Conversation[];
  isLoading: boolean;
  smartSuggestions: Record<string, any>;
  smartSuggestionOnClick: any;
  lastConversationId: number | null;
};

export default function ConversationsList({
  conversations,
  isLoading,
  smartSuggestions,
  smartSuggestionOnClick,
  lastConversationId,
}: ConversationsListProps) {
  const isSmartSuggestionsAvailable =
    smartSuggestions?.suggestions?.length > 0 &&
    !(
      smartSuggestions.suggestions?.length === 1 &&
      smartSuggestions.suggestions[0] === ""
    );

  const [agentMessages, setAgentMessages] = useState("");
  const [lastConversation, setLastConversation] = useState<Conversation | null>(
    null
  );

  useSocketListener("messageFromAgent", updateState);
  function updateState(msg: string) {
    setAgentMessages(agentMessages + msg);
  }

  useEffect(() => {
    if (lastConversationId) {
      const payload = {
        conversation_id: lastConversationId,
        agentConversationHistory: agentMessages,
      };
      (async () => {
        await updateExistingConversation(payload);
        if (agentMessages !== "") {
          setAgentMessages("");
        }
      })();
    }
  }, [lastConversationId]);

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

        const agentConversationHistory = conversation.agentConversationHistory;

        return (
          <div key={idx}>
            <ConversationCard
              conversation={conversation}
              conversationBgColor={conversationBgColor}
              conversationTextColor={conversationTextColor}
              conversationLogo={conversationLogo}
              agentConversationHistory={agentConversationHistory}
            />
          </div>
        );
      })}
      {isLoading && <AgentLoader logo={logo} />}
      {isLoading && (
        <AgentConversation
          agentConversationHistory={agentMessages}
          conversationType="streaming"
        />
      )}

      {isSmartSuggestionsAvailable && (
        <div data-testid="smart-suggestions">
          {smartSuggestions?.type == "oneOf" ? (
            <SmartSuggestionButton
              suggestions={smartSuggestions.suggestions}
              smartSuggestionOnClick={smartSuggestionOnClick}
            />
          ) : (
            <SmartSuggestionCheckbox
              suggestions={smartSuggestions.suggestions}
              smartSuggestionOnClick={smartSuggestionOnClick}
            />
          )}
        </div>
      )}
    </div>
  );
}

const ConversationCard = ({
  conversation,
  conversationBgColor,
  conversationTextColor,
  conversationLogo,
  agentConversationHistory,
}: {
  conversation: any;
  conversationBgColor: any;
  conversationTextColor: any;
  conversationLogo: any;
  agentConversationHistory: any;
}) => {
  const [isShowAgentConversation, setIsShowAgentConversation] = useState(false);

  const handleClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setIsShowAgentConversation(!isShowAgentConversation);
  };

  return (
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
          {agentConversationHistory && (
            <AgentConversation
              agentConversationHistory={agentConversationHistory}
              conversationType="non-streaming"
            />
          )}
        </div>
      </div>
    </div>
  );
};

interface AgentConversationProps {
  agentConversationHistory: string;
  conversationType: string;
}

const AgentConversation: React.FC<AgentConversationProps> = ({
  agentConversationHistory,
  conversationType,
}) => {
  const [isShowAgentConversation, setIsShowAgentConversation] = useState(false);
  const [isOpenOnLoad, setIsOpenOnLoad] = useState(
    conversationType === "streaming" ? true : false
  );

  const handleClick = () => {
    setIsShowAgentConversation(!isShowAgentConversation);
    setIsOpenOnLoad(false);
  };

  const baseColor =
    conversationType === "streaming" ? "captn-dark-blue" : "captn-light-blue";

  const containerStyle =
    conversationType === "streaming"
      ? { maxWidth: "760px", margin: "auto" }
      : {};
  const borderStyle =
    conversationType === "streaming"
      ? { border: "1px solid #003851" }
      : { border: "1px solid #6faabc" };

  return (
    <div style={containerStyle}>
      <button
        onClick={handleClick}
        className={`underline font-medium text-xs ${`text-${baseColor}`}`}
      >
        {isShowAgentConversation || isOpenOnLoad
          ? "Hide details"
          : "Show details"}
      </button>
      {(isShowAgentConversation || isOpenOnLoad) && (
        <div className="text-xs px-3 py-5 break-all " style={borderStyle}>
          <Markdown>{agentConversationHistory}</Markdown>
          {/* <button
            onClick={handleClick}
            className={`mt-5 mx-auto flex px-3 min-h-[44px] py-1 items-center gap-3 transition-colors duration-200 cursor-pointer text-xs rounded-md text-white bg-captn-cta-green hover:bg-captn-cta-green-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex-grow overflow-hidden`}
          >
            Hide details
          </button> */}
        </div>
      )}
    </div>
  );
};
