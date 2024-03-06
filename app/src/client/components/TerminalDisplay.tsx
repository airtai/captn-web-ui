import React, { useEffect, useRef, useState } from 'react';

interface TerminalDisplayProps {
  messages: string;
  maxHeight: number; // Maximum height in pixels
}

const TerminalDisplay: React.FC<TerminalDisplayProps> = ({
  messages,
  maxHeight,
}) => {
  const [isMinimized, setIsMinimized] = useState(false); // Track if terminal is minimized
  const containerRef = useRef<HTMLDivElement | null>(null); // Reference to the scroll container
  const [isAutoScroll, setIsAutoScroll] = useState(true); // Track if auto-scroll is enabled

  // Convert ANSI codes to HTML with inline styles
  const convertAnsiToHtml = (text: string): string => {
    text = text
      .replace(/\[0m/g, '</span>') // Reset / Normal
      .replace(/\[1m/g, '<span style="font-weight: bold;">') // Bold or increased intensity
      .replace(/\[4m/g, '<span style="text-decoration: underline;">') // Underline
      .replace(/\[30m/g, '<span style="color: #003851;">') // Black
      .replace(/\[31m/g, '<span style="color: #c22828;">') // Red
      .replace(/\[32m/g, '<span style="color: #71ad3d;">') // Green
      .replace(/\[33m/g, '<span style="color: #6800a8;">') // Yellow
      .replace(/\[34m/g, '<span style="color: #6e7cbb;">') // Blue
      .replace(/\[35m/g, '<span style="color: #6800a8;">') // Magenta
      .replace(/\[36m/g, '<span style="color: #6faabc;">') // Cyan
      .replace(/\[37m/g, '<span style="color: #eae4d9;">') // White
      .replace(/\n/g, '<br/>'); // Convert newlines to <br/>
    return text;
  };

  const handleUserScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    // If the user scrolls up, disable auto-scroll
    const isAtBottom = el.scrollHeight - el.scrollTop === el.clientHeight;
    setIsAutoScroll(isAtBottom);
  };

  useEffect(() => {
    if (isAutoScroll && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, isAutoScroll]);

  return (
    <div
      className={`accordion-wrapper terminal ${isMinimized ? 'minimized' : ''}`}
    >
      <div className='terminal-header text-white p-1 text-right bg-captn-light-blue'>
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className={`accordion-title ${
            isMinimized ? '' : 'open'
          } text-sm text-captn-light-cream `}
        >
          {isMinimized ? '▲' : '▼'}
        </button>
      </div>
      <div className={`accordion-item ${isMinimized ? '' : 'collapsed'}`}>
        <div
          ref={containerRef}
          onScroll={handleUserScroll}
          className={`accordion-content scroll-container bg-captn-light-cream p-4 text-captn-dark-blue font-mono text-xs overflow-y-auto overflow-x-hidden ${
            isMinimized ? 'hidden' : ''
          }`}
          style={{ maxHeight: `${maxHeight}px` }}
          dangerouslySetInnerHTML={{ __html: convertAnsiToHtml(messages) }}
        />
      </div>
      {/* <Accordion title='Accordion Title'>
        <p>
          This is the content that will be hidden until the accordion is opened.
        </p>
      </Accordion> */}
    </div>
  );
};

export default TerminalDisplay;
