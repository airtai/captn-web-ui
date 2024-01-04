import { test, expect } from "vitest";
import { screen } from "@testing-library/react";

import { renderInContext, mockServer } from "@wasp/test";

import ChatList from "../../components/ChatList";

test("Test ChatList component rendering", async () => {
  const chats = [{ id: 1 }, { id: 2 }];

  // @ts-ignore
  renderInContext(<ChatList chats={chats} />);
  const agentLoaderComponent = screen.getByTestId("chat-list");
  expect(agentLoaderComponent).toBeInTheDocument();

  const childItems = screen.getAllByRole("listitem");
  expect(childItems.length).toBe(2);
});
