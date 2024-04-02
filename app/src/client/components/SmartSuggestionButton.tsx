import { type Chat } from 'wasp/entities';
import {
  createNewChat,
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
      // if the team is created, then create a new chat with conversations before team creation
      if (currentChatDetails.chatType === 'daily_analysis') {
        const newChat: Chat =
          await createNewDailyAnalysisChat(currentChatDetails);
        history.push(`/chat/${newChat.uuid}`);
      } else if (
        currentChatDetails.chatType !== 'daily_analysis' &&
        currentChatDetails.team_name
      ) {
        const chat: Chat = await createNewChat();
        history.push(`/chat/${chat.uuid}`);
      } else {
        // delete the current chat and then send the remaining to openAI
        // get all conversions for the current chat
        // delete the last one and then update the DB, then trigger the submit
        smartSuggestionOnClick(suggestion);
        setIsShowSuggestions(false);
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
