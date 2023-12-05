import HttpError from "@wasp/core/HttpError.js";

import { ADS_SERVER_URL } from "./config.js";

export const checkTeamStatusAndUpdateInDB = (io, context) => {
  io.on("connection", async (socket) => {
    if (socket.data.user) {
      const userEmail = socket.data.user.email;
      console.log("========");
      console.log("a user connected: ", userEmail);

      // Check for updates every 3 seconds
      const updateInterval = setInterval(async () => {
        const conversations = await context.entities.Conversation.findMany({
          where: { userId: socket.data.user.id, team_status: "inprogress" },
        });

        conversations.length > 0 &&
          conversations.forEach(async function (conversation) {
            try {
              const payload = {
                team_id: conversation.team_id,
              };
              const response = await fetch(
                `${ADS_SERVER_URL}/openai/get-team-status`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(payload),
                }
              );

              const json = await response.json();

              // Todo: check how throwing the below error affects the user experience
              if (!response.ok) {
                const errorMsg =
                  json.detail ||
                  `HTTP error with status code ${response.status}`;
                console.error("Server Error:", errorMsg);
                throw new Error(errorMsg);
              }

              const team_status = json["team_status"];
              if (team_status === "completed" || team_status === "pause") {
                // const updated_conversation = conversation.conversation.concat([
                //   { role: "assistant", content: json["msg"] },
                // ]);
                await context.entities.Conversation.update({
                  where: {
                    // userId: socket.data.user.id,
                    id: conversation.id,
                  },
                  data: {
                    team_status: null,
                  },
                });

                await context.entities.Conversation.create({
                  data: {
                    message: json["msg"],
                    role: "assistant",
                    team_name: json["team_name"],
                    team_id: Number(json["team_id"]),
                    team_status: team_status,
                    is_question_from_agent: team_status === "pause",
                    chat: { connect: { id: conversation.chatId } },
                    user: { connect: { id: socket.data.user.id } },
                  },
                });
              }
            } catch (error) {
              throw new HttpError(500, error);
            }
          });
      }, 3000);
    }
  });
};
