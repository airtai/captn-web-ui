import { ReactNode } from 'react';

import AnimatedCharacterLoader from './AnimatedCharacterLoader';

export default function ServerNotRechableComponent({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div>
      <div
        className='sticky top-0 z-999 flex w-full justify-center bg-captn-cta-red'
        style={{ position: 'absolute', zIndex: '10000', top: '0', left: '0' }}
      >
        <AnimatedCharacterLoader
          loadingMessage={
            "Oops! Something went wrong. Our server is currently unavailable. Please do not refresh your browser. We're trying to reconnect..."
          }
          showLogo={false}
          bgColor='bg-captn-cta-red'
        />
      </div>
      <div>{children}</div>
    </div>
  );
}
