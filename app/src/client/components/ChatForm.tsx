import { type Chat } from 'wasp/entities';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

interface ChatFormProps {
  handleFormSubmit: (userQuery: string) => void;
  currentChatDetails: Chat;
  triggerChatFormSubmitMsg?: string | null;
}

export default function ChatForm({
  handleFormSubmit,
  currentChatDetails,
  triggerChatFormSubmitMsg,
}: ChatFormProps) {
  const [formInputValue, setFormInputValue] = useState('');

  const formInputRef = useCallback(
    async (node: any) => {
      if (node !== null && triggerChatFormSubmitMsg) {
        // @ts-ignore
        await handleFormSubmit(triggerChatFormSubmitMsg, true);
      }
      // if (node !== null && userSelectedActionMessage) {
      //   // @ts-ignore
      //   await handleFormSubmit(userSelectedActionMessage, true);
      // }
    },
    [triggerChatFormSubmitMsg]
    // [triggerChatFormSubmitMsg, userSelectedActionMessage]
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentChatDetails.showLoader) {
      setFormInputValue('');
      handleFormSubmit(formInputValue);
    }
  };

  return (
    <div data-testid='chat-form' className='mt-2 mb-2'>
      <form onSubmit={handleSubmit} className=''>
        <label
          htmlFor='search'
          className='mb-2 text-sm font-medium text-captn-dark-blue sr-only dark:text-captn-light-cream'
        >
          Search
        </label>
        <div className='relative bottom-0 left-0 right-0 flex items-center justify-between m-1'>
          <TextareaAutosize
            minRows={1}
            maxRows={4}
            style={{
              lineHeight: 2,
              resize: 'none',
            }}
            id='userQuery'
            name='search'
            className='block rounded-lg w-full h-12 text-sm text-captn-light-cream bg-captn-dark-blue focus:outline-none focus:ring-0 focus:border-captn-light-blue'
            placeholder='Message Capt’n...'
            required
            ref={formInputRef}
            value={formInputValue}
            onChange={(e) => setFormInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e as any);
              }
            }}
          />
          <button
            type='submit'
            className={`text-captn-light-cream bg-captn-cta-green hover:bg-captn-cta-green-hover absolute right-2 font-medium rounded-lg text-sm px-1.5 py-1.5`}
          >
            <span className=''>
              <svg
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                className='text-captn-light-cream'
              >
                <path
                  d='M7 11L12 6L17 11M12 18V7'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                ></path>
              </svg>
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
