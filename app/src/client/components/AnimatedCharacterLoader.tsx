import React, { useState, useEffect } from 'react';

import logo from '../static/captn-logo.png';

interface AnimatedCharacterLoaderProps {
  loadingMessage?: string; // Optional prop for customizing the loading message
  bgColor?: string;
  showLogo?: boolean;
}

const AnimatedCharacterLoader: React.FC<AnimatedCharacterLoaderProps> = ({
  loadingMessage = 'Loading...', // Default loading message
  bgColor = 'bg-captn-dark-blue',
  showLogo = true,
}) => {
  const [frameIndex, setFrameIndex] = useState(0); // State to track the current frame of the animation
  const loadingAnimation = ['—', '\\', '|', '/']; // Characters used for the loading animation

  useEffect(() => {
    // Set up an interval to cycle through the animation characters
    const interval = setInterval(() => {
      setFrameIndex((prevIndex) => (prevIndex + 1) % loadingAnimation.length); // Cycle through indices in a loop
    }, 250); // Animation frame update interval in milliseconds

    // Cleanup function to clear the interval on component unmount
    return () => clearInterval(interval);
  }, [loadingAnimation.length]); // Dependence on the length is constant, but included for completeness

  return (
    <div
      style={{ minHeight: '85px' }}
      className={`flex items-center px-5 group ${bgColor} flex-col agent-conversation-container`}
    >
      <div
        style={{ maxWidth: '800px', margin: 'auto' }}
        className={`relative ml-3 block w-full p-4 pl-10 text-sm text-captn-light-cream  border-captn-dark-blue rounded-lg ${bgColor} `}
      >
        {showLogo && (
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
        )}
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
