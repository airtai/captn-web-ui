import { test, expect } from "vitest";
import { screen } from "@testing-library/react";

import { renderInContext, mockServer } from "@wasp/test";

import ConversationsList from "../../components/ConversationList";

test("Test ConversationsList component rendering", async () => {
  const chats = [{ id: 1 }, { id: 2 }];
  const conversations = [
    { role: "user", message: "hello" },
    { role: "agent", message: "hi" },
  ];
  // @ts-ignore
  renderInContext(
    <ConversationsList
      // @ts-ignore
      conversations={conversations}
      isLoading={false}
      smartSuggestions={[]}
      smartSuggestionOnClick={() => {}}
    />
  );
  const component = screen.getByTestId("conversations-wrapper");
  expect(component).toBeInTheDocument();
});

test("Should not render SmartSuggestions component if the suggestions are empty", async () => {
  const chats = [{ id: 1 }, { id: 2 }];
  const conversations = [
    { role: "user", message: "hello" },
    { role: "agent", message: "hi" },
  ];
  // @ts-ignore
  renderInContext(
    <ConversationsList
      // @ts-ignore
      conversations={conversations}
      isLoading={false}
      smartSuggestions={[]}
      smartSuggestionOnClick={() => {}}
    />
  );
  const component = screen.queryByTestId("smart-suggestions");
  expect(component).not.toBeInTheDocument();
});

test("Should not render SmartSuggestions component if the suggestion is a empty list", async () => {
  const chats = [{ id: 1 }, { id: 2 }];
  const conversations = [
    { role: "user", message: "hello" },
    { role: "agent", message: "hi" },
  ];
  // @ts-ignore
  renderInContext(
    <ConversationsList
      // @ts-ignore
      conversations={conversations}
      isLoading={false}
      smartSuggestions={[""]}
      smartSuggestionOnClick={() => {}}
    />
  );
  const component = screen.queryByTestId("smart-suggestions");
  expect(component).not.toBeInTheDocument();
});

test("Should render SmartSuggestions component", async () => {
  const chats = [{ id: 1 }, { id: 2 }];
  const conversations = [
    { role: "user", message: "hello" },
    { role: "agent", message: "hi" },
  ];
  // @ts-ignore
  renderInContext(
    <ConversationsList
      // @ts-ignore
      conversations={conversations}
      isLoading={false}
      smartSuggestions={["Hi"]}
      smartSuggestionOnClick={() => {}}
    />
  );
  const component = screen.getByTestId("smart-suggestions");
  expect(component).toBeInTheDocument();
});
