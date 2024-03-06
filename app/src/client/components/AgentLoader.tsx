import React, { useState, useEffect } from 'react';
import Markdown from 'markdown-to-jsx';

import AgentConversationHistory from './AgentConversationHistory';

export default function AgentLoader({
  logo,
  streamingAgentResponse,
}: {
  logo: string;
  streamingAgentResponse?: string;
}) {
  const responseContentOptions = [
    "<span>I'm currently setting sail through the uncharted waters of your request.<br/>Kindly stay anchored, and I promise not to send you adrift; I'll return with the treasure trove of information soon!</span>",
    "<span>I'm presently charting a course through the mystic waters of your inquiry.<br/>Please stay anchored, and I'll navigate through the data waves to reach you swiftly like a nimble pirate searching for treasure.</span>",
    "<span>I'm currently sailing through the vast sea of your request.<br/>Please stay anchored, and I'll respond like a trusty lighthouse once I've spotted the information on the horizon.</span>",
    "<span>I'm cruising through the open waters of your inquiry right now.<br/>Please remain anchored, and I'll make sure to steer clear of any data whirlpools as I return with the information you seek.</span>",
    "<span>I'm navigating the tides of your inquiry at the moment.<br/>Stay moored, and I'll ensure to respond promptly, just like a seasoned sailor catching a favorable wind.</span>",
    "<span>I'm currently exploring the depths of your request.<br/>Please stay anchored, and I'll dive into the ocean of information to bring you back a pearl of wisdom soon!</span>",
    "<span>I'm currently navigating the waters of your request, like a sailor on a quest for buried treasure.<br/>Stay anchored, and I'll return with the information booty soon!</span>",
    "<span>I'm exploring the vast ocean of your request, like a captain on a digital voyage.<br/>Remain anchored, and I'll navigate through the data waves to bring you the treasure map you seek!</span>",
    '<span>I am presently navigating the waters of your request.<br />Kindly stay anchored, and I will promptly return to you once I have information to share.</span>',
    "<span>I'm currently charting a course through your inquiry's waters.<br/>Please stay anchored, and I'll swiftly respond once I have the relevant information.</span>",
  ];

  const [waitingForResponseContent, setWaitingForResponseContent] =
    useState<string>('');

  useEffect(() => {
    const shuffledOptions = [...responseContentOptions].sort(
      () => Math.random() - 0.5
    );
    setWaitingForResponseContent(shuffledOptions[0]);
  }, []);

  return (
    <div
      data-testid='agent-loader'
      className={`flex items-center px-5 py-2 group  flex-col bg-captn-dark-blue`}
      style={{ minHeight: '85px' }}
    >
      <div
        className='relative ml-3 block w-full p-4 pl-10 text-sm text-captn-light-cream  rounded-lg '
        style={{ maxWidth: '800px', margin: 'auto' }}
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
          <img
            alt='Capt’n.ai logo'
            src={logo}
            className='w-full h-full'
            style={{ borderRadius: '50%' }}
          />
        </span>
        <div className='chat-conversations text-base flex flex-col gap-2'>
          {/* <Markdown> */}
          <div className='w-64 ml-2 -mt-2'>
            <div className='chat-bubble'>
              <div className='typing'>
                <div className='dot'></div>
                <div className='dot'></div>
                <div className='dot'></div>
              </div>
            </div>
          </div>
          {/* </Markdown> */}
          {streamingAgentResponse && (
            <AgentConversationHistory
              agentConversationHistory={streamingAgentResponse}
              initialState={true}
            />
          )}
        </div>
      </div>
    </div>
  );
}
