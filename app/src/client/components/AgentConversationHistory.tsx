import React, { useState } from 'react';
import TerminalDisplay from './TerminalDisplay';

interface AgentConversationHistoryProps {
  agentConversationHistory: string;
  initialState?: boolean;
}

const AgentConversationHistory: React.FC<AgentConversationHistoryProps> = ({
  agentConversationHistory,
  initialState = false,
}) => {
  const [showHistory, setShowHistory] = useState(initialState);

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  return (
    <div
      data-testid='agent-loader'
      className={`flex items-center group  flex-col bg-captn-dark-blue`}
    >
      <div
        style={{ maxWidth: '700px', margin: '0 auto 20' }}
        className={`relative block w-full`}
      >
        <span
          onClick={toggleHistory}
          className={`relative inline-block mt-2 mb-1 underline text-captn-light-blue hover:cursor-pointer`}
        >
          {showHistory
            ? 'Collapse agents conversation'
            : 'Expand agents conversation'}
        </span>
        <div
          className={`transform origin-top transition-transform ease-in-out duration-500 min-h-5 ${
            showHistory ? 'scale-y-100 block' : 'scale-y-0 hidden'
          }`}
        >
          <TerminalDisplay
            messages={agentConversationHistory}
            maxHeight={400}
          />
        </div>
      </div>
    </div>
  );
};

export default AgentConversationHistory;
