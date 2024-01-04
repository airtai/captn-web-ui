import React from "react";
import Markdown from "markdown-to-jsx";

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
        className={`flex items-center px-5 py-5 group bg-captn-light-blue flex-col`}
      >
        <div
          style={{ maxWidth: "840px", margin: "auto" }}
          className={`fade-in shadow-sm shadow-captn-dark-blue relative ml-3 block w-full p-4 text-sm text-captn-dark-blue border-captn-dark-blue rounded-lg bg-captn-light-cream `}
        >
          <p className="text-sm font-semibold text-captn-dark-blue">
            Quick Reply:
          </p>
          <div className="my-2 chat-conversations text-base flex flex-col flex-wrap">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className=" shadow-sm shadow-captn-light-blue m-2 bg-transparent hover:bg-captn-dark-blue text-captn-dark-blue hover:text-captn-light-cream font-semibold mx-4 py-2 px-4 border border-captn-light-blue hover:border-transparent rounded-full"
                onClick={() =>
                  handleSuggestionClick(suggestion, smartSuggestionOnClick)
                }
              >
                <Markdown>{suggestion}</Markdown>
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
