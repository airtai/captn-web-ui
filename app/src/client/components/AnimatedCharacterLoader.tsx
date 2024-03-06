import React, { useState, useEffect } from 'react';

import Markdown from 'markdown-to-jsx';
import logo from '../static/captn-logo.png';

interface AnimatedCharacterLoaderProps {
  loadInterval?: number; // Optional prop with a default value
  loadingMessage?: string; // Optional prop with a default value
}

const AnimatedCharacterLoader: React.FC<AnimatedCharacterLoaderProps> = ({
  loadInterval = 60,
  loadingMessage = 'Loading...',
}) => {
  const [frameIndex, setFrameIndex] = useState<number>(0); // Explicitly type the state variable
  const loadingAnimation: string[] = ['—', '\\', '|', '/']; // Explicitly type the array

  useEffect(() => {
    const interval = setInterval(() => {
      setFrameIndex((prevIndex) => (prevIndex + 1) % loadingAnimation.length);
    }, 250);

    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, loadInterval * 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [loadInterval, loadingAnimation.length]);

  return (
    <div
      style={{ minHeight: '85px' }}
      className={`flex items-center px-5 group bg-captn-dark-blue flex-col agent-conversation-container`}
    >
      <div
        style={{ maxWidth: '700px', margin: 'auto' }}
        className={`relative ml-3 block w-full p-4 pl-10 text-sm text-captn-light-cream  border-captn-dark-blue rounded-lg bg-captn-dark-blue `}
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
          {loadingMessage} {loadingAnimation[frameIndex]}
          {/* </Markdown> */}
        </div>
      </div>
    </div>
  );
};

export default AnimatedCharacterLoader;
