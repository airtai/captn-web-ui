import HttpError from "@wasp/core/HttpError.js";

const ADS_SERVER_URL = process.env.ADS_SERVER_URL || "http://127.0.0.1:9000";

export const webSocketFn = (io, context) => {
  io.on("connection", async (socket) => {
    if (socket.data.user) {
      const userEmail = socket.data.user.email;
      console.log("========");
      console.log("a user connected: ", userEmail);

      // Check for updates every 5 seconds
      const updateInterval = setInterval(async () => {
        console.log("Check for inprogress tasks update");
        const conversations = await context.entities.Conversation.findMany({
          where: { userId: socket.data.user.id, status: "inprogress" },
        });

        conversations.length > 0 &&
          conversations.forEach(async function (conversation) {
            try {
              const payload = {
                conversation_id: conversation.id,
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

              const conversation_status = json["status"];
              if (conversation_status === "ready") {
                const updated_conversation = conversation.conversation.concat([
                  { role: "assistant", content: json["msg"] },
                ]);
                await context.entities.Conversation.update({
                  where: {
                    // userId: socket.data.user.id,
                    id: conversation.id,
                  },
                  data: {
                    conversation: updated_conversation,
                    status: conversation_status,
                  },
                });

                // io.emit("updateChatUI");
              }
            } catch (error) {
              throw new HttpError(500, error);
            }
          });
      }, 5000);
    }
  });
};
