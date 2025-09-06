import { Hono } from "hono";
import { serve } from '@hono/node-server';
import { createNodeWebSocket } from "@hono/node-ws";
import { WSMessageReceive } from "hono/ws";
import { apiRoute } from "./routes/api";
import { validateHash } from "./routes/ws";
import { Task } from "./datas/problem/metadata/tasks/task/task";

type CompatibleProblem = {
  runtime: () => Task;
};

type AppVariables = {
  problem: CompatibleProblem;
};

const app = new Hono<{ Variables: AppVariables }>();

// Create WebSocket support for the main app
const { upgradeWebSocket, injectWebSocket } = createNodeWebSocket({ app });

// Add API routes
app.route("/api", apiRoute);

// Add WebSocket route directly in main app
app.get("/ws", validateHash, upgradeWebSocket((c) => {
  const problem = c.get("problem");
  if (!problem) {
    // Return a default WebSocket handler that closes immediately
    return {
      onOpen: (_, ws) => {
        ws.send("Error: No problem configured");
        ws.close();
      },
      onMessage: () => {},
      onClose: () => {},
      onError: () => {},
    };
  }
  
  const task = problem.runtime();

  return {
    onOpen: (_, ws) => {
      task.onMessage((data) => ws.send(data));

      task.onDisconnect(() => {
        ws.send("[Wrapper] The app has exited\n");
        ws.close();
      });
    },
    onMessage: async (event, _ws) => {
      const data: WSMessageReceive = event.data;
      let str: string;

      try {
        if (typeof data === "string") {
          str = data;
        } else if (data instanceof Blob) {
          str = await data.text();
        } else if (data instanceof ArrayBuffer) {
          str = new TextDecoder().decode(data);
        } else if (ArrayBuffer.isView(data)) {
          const uint8Array = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
          str = new TextDecoder().decode(uint8Array);
        } else {
          console.warn("Received unsupported message type:", data);
          return;
        }
        task.writeStdin(str);
      } catch (error) {
        console.error("Failed to process WebSocket message:", error);
      }
    },
    onClose: () => {
      task.kill();
    },
    onError: (error) => {
      console.error("WebSocket error:", error);
      task.kill();
    },
  };
}));

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

console.log(`Starting server on port ${port}`);
const server = serve({
  fetch: app.fetch,
  port: port,
});

injectWebSocket(server);
