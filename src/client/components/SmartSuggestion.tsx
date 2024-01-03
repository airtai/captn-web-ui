import React from "react";

export default function SmartSuggestion({
  suggestions,
  smartSuggestionOnClick,
}: {
  suggestions: string[];
  smartSuggestionOnClick: any;
}) {
  return (
    <div>
      <div
        style={{ minHeight: "85px" }}
        className={`flex items-center px-5 py-2 group bg-captn-light-blue flex-col`}
      >
        <div
          style={{ maxWidth: "840px", margin: "auto" }}
          className={`relative ml-3 block w-full p-4 pl-10 text-sm text-captn-dark-blue border-captn-dark-blue rounded-lg bg-captn-dark-blue `}
        >
          <div className="chat-conversations text-base flex flex-col gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className={`text-white bg-captn-cta-green hover:bg-captn-cta-green-hover focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5`}
                onClick={() =>
                  handleSuggestionClick(suggestion, smartSuggestionOnClick)
                }
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function handleSuggestionClick(
  suggestion: string,
  smartSuggestionOnClick: any
) {
  console.log(`Suggestion "${suggestion}" clicked.`);
  smartSuggestionOnClick(suggestion);
}
