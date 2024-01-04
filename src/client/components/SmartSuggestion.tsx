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
      <div className={`-mt-5 pb-4 flex items-center group bg-captn-dark-blue`}>
        <div
          style={{ maxWidth: "840px", margin: "auto" }}
          className={`fade-in  relative ml-3 block w-full px-4 rounded-lg bg-captn-light-green `}
        >
          {/* <p className="text-sm ml-5 font-semibold text-captn-light-cream">
            Quick Reply:
          </p> */}
          <div className="my-2 ml-5 chat-conversations text-base flex flex-wrap">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className=" bg-captn-cta-green hover:bg-captn-cta-green-hover focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2 m-1 text-white"
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
