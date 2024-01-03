import { test, expect } from "vitest";
import { screen } from "@testing-library/react";

import { renderInContext, mockServer } from "@wasp/test";

import SmartSuggestion from "../../components/SmartSuggestion";

test("Test SmartSuggestion component rendering", async () => {
  const suggestions = ["a", "b", "c"];
  // @ts-ignore
  renderInContext(
    <SmartSuggestion
      suggestions={suggestions}
      smartSuggestionOnClick={() => {}}
    />
  );
  const childItems = screen.getAllByRole("button");
  expect(childItems.length).toBe(3);
});
