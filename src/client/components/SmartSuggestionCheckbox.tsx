import React, { useState } from "react";
import Markdown from "markdown-to-jsx";

export default function SmartSuggestionCheckbox({
  suggestions,
  smartSuggestionOnClick,
}: {
  suggestions: string[];
  smartSuggestionOnClick: any;
}) {
  const [selectedItems, setSelectedItems] = useState([]);

  const handleCheckboxChange = (event: any) => {
    const suggestion = event.target.value;
    if (event.target.checked) {
      // @ts-ignore
      setSelectedItems([...selectedItems, suggestion]);
    } else {
      setSelectedItems(
        selectedItems.filter((selected) => selected !== suggestion)
      );
    }
  };

  const handlePrintSelected = () => {
    if (selectedItems.length > 0) {
      const msg =
        selectedItems.length > 1
          ? `I want to ${
              selectedItems.slice(0, -1).join(", ") +
              " and " +
              selectedItems[selectedItems.length - 1]
            }`
          : `I want to ${selectedItems[0]}`;
      smartSuggestionOnClick(msg);
    }
  };
  const helpMessage =
    "You can choose from the listed options above or type your own answers in the input field below.";
  return (
    <div className="pb-4 flex items-center group bg-captn-dark-blue">
      <div
        style={{ maxWidth: "840px", margin: "auto" }}
        className={`fade-in  relative ml-3 block w-full px-4 rounded-lg bg-captn-light-green `}
      >
        <div className="ml-6 chat-conversations text-base flex flex-wrap">
          {suggestions.map((suggestion, index) => (
            <label key={index} className="flex items-center me-4">
              <input
                type="checkbox"
                value={suggestion}
                onChange={handleCheckboxChange}
                // @ts-ignore
                checked={selectedItems.includes(suggestion)}
                className="accent-pink-300 rounded-sm accent-captn-cta-green"
              />
              <span className="ml-2 mt-1 text-captn-light-cream">
                {suggestion}
              </span>
            </label>
          ))}

          <button
            onClick={handlePrintSelected}
            className={`${
              selectedItems.length > 0
                ? ""
                : "bg-gray-400 cursor-not-allowed hover:bg-gray-500"
            }  bg-captn-cta-green hover:bg-captn-cta-green-hover focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2 m-1 text-white`}
          >
            Send
          </button>
        </div>

        <p className="my-2 ml-6 pt-2 text-captn-light-cream">
          You can select an option from the list above and click the send
          button, or type your own responses in the input field below.
        </p>
      </div>
    </div>
  );
}
