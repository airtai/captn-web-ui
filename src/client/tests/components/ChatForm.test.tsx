import { test, expect } from "vitest";
import { screen } from "@testing-library/react";

import { renderInContext, mockServer } from "@wasp/test";

import ChatForm from "../../components/ChatForm";

test("Test ChatForm component rendering", async () => {
  renderInContext(
    <ChatForm
      handleFormSubmit={() => {}}
      isSubmitButtonDisabled={false}
      chatId={1}
      googleRedirectLoginMsg="Login message"
      addMessagesToConversation={() => {}}
    />
  );

  const agentLoaderComponent = screen.getByTestId("chat-form");
  expect(agentLoaderComponent).toBeInTheDocument();
});
