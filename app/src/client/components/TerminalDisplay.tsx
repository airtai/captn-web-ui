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
      .replace(/\[30m/g, '<span style="color: black;">') // Black
      .replace(/\[31m/g, '<span style="color: red;">') // Red
      .replace(/\[32m/g, '<span style="color: green;">') // Green
      .replace(/\[33m/g, '<span style="color: yellow;">') // Yellow
      .replace(/\[34m/g, '<span style="color: blue;">') // Blue
      .replace(/\[35m/g, '<span style="color: magenta;">') // Magenta
      .replace(/\[36m/g, '<span style="color: cyan;">') // Cyan
      .replace(/\[37m/g, '<span style="color: white;">') // White
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
    <div className={`terminal ${isMinimized ? 'minimized' : ''}`}>
      <div className='terminal-header bg-gray-800 text-white p-1 text-right'>
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className='text-sm'
        >
          {isMinimized ? '▲' : '▼'}
        </button>
      </div>
      <div
        ref={containerRef}
        onScroll={handleUserScroll}
        className={`scroll-container bg-black p-4 text-white font-mono text-xs overflow-y-auto overflow-x-hidden ${
          isMinimized ? 'hidden' : ''
        }`}
        style={{ maxHeight: `${maxHeight}px` }}
        dangerouslySetInnerHTML={{ __html: convertAnsiToHtml(messages) }}
      />
    </div>
  );
};

export default TerminalDisplay;
