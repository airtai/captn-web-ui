import React from 'react';
import { useState, useEffect } from 'react';

import Markdown from 'markdown-to-jsx';

import type { Conversation, Chat } from '@wasp/entities';
import AgentLoader from './AgentLoader';
import SmartSuggestionButton from './SmartSuggestionButton';
import SmartSuggestionCheckbox from './SmartSuggestionCheckbox';
import LetterByLetterDisplay from './LetterByLetterDisplay';
import logo from '../static/captn-logo.png';

type ConversationsListProps = {
  conversations: Conversation[];
  currentChatDetails: Chat;
  handleFormSubmit: any;
  userSelectedActionMessage?: string | null;
  onStreamAnimationComplete?: () => void;
};

export default function ConversationsList({
  conversations,
  currentChatDetails,
  handleFormSubmit,
  userSelectedActionMessage,
  onStreamAnimationComplete,
}: ConversationsListProps) {
  // @ts-ignore
  const smartSuggestions = currentChatDetails?.smartSuggestions?.suggestions;
  // @ts-ignore
  const smartSuggestionsLength = smartSuggestions?.length;
  // @ts-ignore
  const isSmartSuggestionsAvailable =
    // @ts-ignore
    smartSuggestionsLength > 0 &&
    !(
      smartSuggestionsLength === 1 &&
      // @ts-ignore
      currentChatDetails?.smartSuggestions.suggestions[0] === ''
    );
  const lastConversationIdx = conversations.length - 1;
  return (
    <div data-testid='conversations-wrapper' className='w-full'>
      {conversations.map((conversation, idx) => {
        const isUserConversation = conversation.role === 'user';
        const conversationBgColor = isUserConversation
          ? 'captn-light-blue'
          : 'captn-dark-blue';
        const conversationTextColor = isUserConversation
          ? 'captn-dark-blue'
          : // : 'captn-light-cream';
            'white';
        const conversationLogo = isUserConversation ? (
          <div
            style={{
              alignItems: 'center',
              background: '#fff',
              borderRadius: '50%',
              color: '#444654',
              display: 'flex',
              flexBasis: '40px',
              flexGrow: '0',
              flexShrink: '0',
              fontSize: '14px',
              height: '40px',
              justifyContent: 'center',
              padding: '5px',
              position: 'relative',
              width: '40px',
            }}
            className='flex'
          >
            <div>You</div>
          </div>
        ) : (
          <img
            alt='Capt’n.ai logo'
            src={logo}
            className='w-full h-full'
            style={{ borderRadius: '50%' }}
          />
        );

        return (
          <div key={idx}>
            <div
              style={{ minHeight: '85px' }}
              className={`flex items-center px-5 group bg-${conversationBgColor} flex-col ${
                isUserConversation
                  ? 'user-conversation-container'
                  : 'agent-conversation-container'
              }`}
            >
              <div
                style={{ maxWidth: '700px', margin: 'auto' }}
                className={`relative ml-3 block w-full p-4 pl-10 text-sm text-${conversationTextColor}  border-${conversationBgColor} rounded-lg bg-${conversationBgColor} `}
              >
                <span
                  className='absolute inline-block'
                  style={{
                    left: '-15px',
                    top: '6px',
                    height: ' 45px',
                    width: '45px',
                  }}
                >
                  {conversationLogo}
                </span>
                {idx === lastConversationIdx && !isUserConversation && (
                  <div className='chat-conversations text-base flex flex-col gap-2'>
                    {currentChatDetails?.streamAgentResponse &&
                    !currentChatDetails?.team_id ? (
                      <LetterByLetterDisplay
                        sentence={conversation.message}
                        speed={5}
                        onStreamAnimationComplete={onStreamAnimationComplete}
                      />
                    ) : (
                      <Markdown>{conversation.message}</Markdown>
                    )}
                  </div>
                )}
                {(idx !== lastConversationIdx ||
                  (idx === lastConversationIdx && isUserConversation)) && (
                  <div className='chat-conversations text-base flex flex-col gap-2'>
                    <Markdown>{conversation.message}</Markdown>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
      {currentChatDetails?.team_status === 'inprogress' && (
        <AgentLoader logo={logo} />
      )}

      {isSmartSuggestionsAvailable &&
        !currentChatDetails?.streamAgentResponse && (
          <div data-testid='smart-suggestions' className='fadeIn'>
            {
              // @ts-ignore
              currentChatDetails.smartSuggestions?.type == 'oneOf' ? (
                <SmartSuggestionButton
                  currentChatDetails={currentChatDetails}
                  smartSuggestionOnClick={handleFormSubmit}
                />
              ) : (
                <SmartSuggestionCheckbox
                  suggestions={
                    // @ts-ignore
                    currentChatDetails.smartSuggestions.suggestions
                  }
                  smartSuggestionOnClick={handleFormSubmit}
                  chatType={currentChatDetails.chatType}
                  userSelectedActionMessage={userSelectedActionMessage}
                />
              )
            }
          </div>
        )}
    </div>
  );
}
