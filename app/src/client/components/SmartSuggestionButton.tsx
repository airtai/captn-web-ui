import { type Chat } from 'wasp/entities';
import {
  retryTeamChat,
  createNewDailyAnalysisChat,
} from 'wasp/client/operations';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import Markdown from 'markdown-to-jsx';

export default function SmartSuggestionButton({
  currentChatDetails,
  smartSuggestionOnClick,
}: {
  currentChatDetails: Chat;
  smartSuggestionOnClick: any;
}) {
  const [isShowSuggestions, setIsShowSuggestions] = useState(true);
  const history = useHistory();
  // @ts-ignore
  const suggestions = currentChatDetails.smartSuggestions.suggestions;
  async function handleSuggestionClick(
    suggestion: string,
    smartSuggestionOnClick: any
  ) {
    if (currentChatDetails.isExceptionOccured) {
      if (currentChatDetails.chatType === 'daily_analysis') {
        const [newChat, lastConversationMessage] =
          await createNewDailyAnalysisChat(currentChatDetails);
        history.push(`/chat/${newChat.uuid}?msg=${lastConversationMessage}`);
      } else {
        if (currentChatDetails.team_name) {
          const [chat, lastConversationMessage] = await retryTeamChat(
            currentChatDetails.id
          );
          history.push(`/chat/${chat.uuid}?msg=${lastConversationMessage}`);
        } else {
          setIsShowSuggestions(false);
          smartSuggestionOnClick(null, false, true);
        }
      }
    } else {
      smartSuggestionOnClick(suggestion);
      setIsShowSuggestions(false);
    }
  }
  return (
    <div>
      <div className={` pb-4 flex items-center group bg-captn-dark-blue`}>
        <div
          style={{ maxWidth: '800px', margin: 'auto' }}
          className={`fade-in  relative ml-3 block w-full px-4 rounded-lg bg-captn-light-green ${
            isShowSuggestions ? 'opacity-100' : 'opacity-0'
          }}`}
        >
          <div className='ml-5 chat-conversations text-base flex flex-wrap'>
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className=' bg-captn-cta-green hover:bg-captn-cta-green-hover font-medium rounded-lg text-sm px-3 py-2 m-1 text-captn-light-cream'
                onClick={() =>
                  handleSuggestionClick(suggestion, smartSuggestionOnClick)
                }
              >
                <Markdown>{suggestion}</Markdown>
              </button>
            ))}
          </div>
          {!currentChatDetails.isExceptionOccured && (
            <p className='my-2 ml-6 pt-2 text-captn-light-cream'>
              You can choose from the listed options above or type your own
              answers in the input field below.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
