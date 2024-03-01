import React, { useEffect, useRef, useState } from 'react';

interface TerminalDisplayProps {
  messages: string;
  maxHeight: number; // Maximum height in pixels
}

const TerminalDisplay: React.FC<TerminalDisplayProps> = ({
  messages,
  maxHeight,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isAutoScroll, setIsAutoScroll] = useState(true);

  // Convert ANSI codes to HTML with inline styles
  const convertAnsiToHtml = (text: string): string => {
    return text
      .replace(/\[32m/g, '<span style="color: green;">')
      .replace(/\[35m/g, '<span style="color: magenta;">')
      .replace(/\[0m/g, '</span>');
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
      ref={containerRef}
      onScroll={handleUserScroll}
      className='scroll-container bg-black p-4 text-white font-mono text-sm overflow-y-auto'
      style={{ maxHeight: `${maxHeight}px` }}
      dangerouslySetInnerHTML={{ __html: convertAnsiToHtml(messages) }}
    />
  );
};

export default TerminalDisplay;
