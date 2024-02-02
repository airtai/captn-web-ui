import HttpError from "@wasp/core/HttpError.js";

import WebSocket from "ws";
import { ADS_SERVER_URL } from "./config.js";

async function checkTeamStatus(context, socket, chat_id) {
  let json;
  const ws = new WebSocket(
    `ws://${ADS_SERVER_URL.split("//")[1]}/openai/ws/${socket.data.user.id}`
  );
  ws.onopen = () => {
    console.log("========");
    console.log("ws.on open");
    console.log("========");
    ws.send("Hello");
  };
  ws.on("message", (message) => {
    socket.emit("messageFromAgent", `${message}`);
    // console.log(`Received message from server: ${message}`);
  });
  ws.on("close", () => {
    console.log("WebSocket connection closed");
  });

  try {
    while (true) {
      // Infinite loop, adjust the exit condition as needed
      const payload = {
        team_id: chat_id,
      };
      const response = await fetch(`${ADS_SERVER_URL}/openai/get-team-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorMsg = `HTTP error with status code ${response.status}`;
        console.error("Server Error:", errorMsg);
      } else {
        json = await response.json();
        const team_status = json["team_status"];

        if (team_status === "completed" || team_status === "pause") {
          // Exit the loop when the desired condition is met
          break;
        }
      }

      // ws.onopen = () => {
      //   console.log("========");
      //   console.log("ws.on open");
      //   ws.send("Summa");
      // };
      // ws.on("message", (message) => {
      //   console.log("========");
      //   console.log("ws.on message");
      //   socket.emit("messageFromAgent", `${message}`);
      //   console.log("========");
      //   console.log(`Received message from server: ${message}`);
      // });

      // update the below code to emit a message to the user
      await new Promise((resolve) => {
        setTimeout(() => {
          // socket.emit("messageFromAgent", generateRandomString());
          resolve();
        }, 1000);
      });
    }
    // Call another function after breaking the loop
    await updateConversationsInDb(context, socket, json, chat_id);
  } catch (error) {
    console.log(`Error while fetching record`);
    console.log(error);
  }
}

async function updateConversationsInDb(context, socket, json, chat_id) {
  await context.entities.Chat.update({
    where: {
      // userId: socket.data.user.id,
      id: chat_id,
    },
    data: {
      team_status: null,
      smartSuggestions: json["smart_suggestions"],
    },
  });

  const conv = await context.entities.Conversation.create({
    data: {
      message: json["msg"],
      role: "assistant",
      chat: { connect: { id: chat_id } },
      user: { connect: { id: socket.data.user.id } },
    },
  });

  socket.emit("newConversationAddedToDB", conv.id);
}

export const checkTeamStatusAndUpdateInDB = (io, context) => {
  // When a new user is connected
  io.on("connection", async (socket) => {
    if (socket.data.user) {
      const userEmail = socket.data.user.email;
      console.log("========");
      console.log("a user connected: ", userEmail);

      // Socket to receive agent messages
      // const ws = new WebSocket(
      //   `ws://127.0.0.1:9000/openai/ws/${socket.data.user.id}`
      // );

      // ws.onopen = () => {
      //   console.log("========");
      //   console.log("ws.on open");
      //   console.log("========");
      //   ws.send("Summa");
      // };
      // ws.on("message", (message) => {
      //   socket.emit("messageFromAgent", `${message}`);
      //   // console.log(`Received message from server: ${message}`);
      // });
      // ws.on("close", () => {
      //   console.log("WebSocket connection closed");
      // });

      socket.on("newConversationAdded", async (chat_id) => {
        await checkTeamStatus(context, socket, chat_id);
      });
    }
  });
};
