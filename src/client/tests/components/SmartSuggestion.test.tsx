import { test, expect } from "vitest";
import { screen } from "@testing-library/react";

import { renderInContext, mockServer } from "@wasp/test";

import SmartSuggestionButton from "../../components/SmartSuggestionButton";

test("Test SmartSuggestion component rendering", async () => {
  const suggestions = ["a", "b", "c"];
  // @ts-ignore
  renderInContext(
    <SmartSuggestionButton
      suggestions={suggestions}
      smartSuggestionOnClick={() => {}}
    />
  );
  const childItems = screen.getAllByRole("button");
  expect(childItems.length).toBe(3);
});
