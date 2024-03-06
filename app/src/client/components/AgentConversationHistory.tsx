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
        style={{ maxWidth: '800px', margin: '0 auto 20' }}
        className={`relative block w-full`}
      >
        <TerminalDisplay messages={agentConversationHistory} maxHeight={400} />
      </div>
    </div>
  );
};

export default AgentConversationHistory;
