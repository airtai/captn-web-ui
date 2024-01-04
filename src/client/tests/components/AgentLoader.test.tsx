import { test, expect } from "vitest";
import { screen } from "@testing-library/react";

import { renderInContext } from "@wasp/test";

import AgentLoader from "../../components/AgentLoader";
import logo from "../static/captn-logo.png";

test("Test AgentLoader component rendering", async () => {
  renderInContext(<AgentLoader logo={logo} />);
  const agentLoaderComponent = screen.getByTestId("agent-loader");

  expect(agentLoaderComponent).toBeInTheDocument();
  screen.debug();
});
