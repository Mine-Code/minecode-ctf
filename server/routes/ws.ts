import { Hono, type Next } from "hono";
import type { Context } from "hono";
import { createNodeWebSocket } from "@hono/node-ws";
import { WSMessageReceive } from "hono/ws";
import problems from "../datas/problem_manager.js";
import { Task } from "../datas/problem/metadata/tasks/task/task.js";

type CompatibleProblem = {
  runtime: () => Task;
};

type AppVariables = {
  problem: CompatibleProblem;
};

const app = new Hono<{ Variables: AppVariables }>();

const { upgradeWebSocket, injectWebSocket } = createNodeWebSocket({ app });

// validate hash param before upgrade to WebSocket
const validateHash = async (
  c: Context<{ Variables: AppVariables }>,
  next: Next
) => {
  const hash = c.req.query("hash");
  if (!hash) {
    return c.text("hash is not specified", 400);
  }

  const problem = problems.getProblemWithHash(hash);
  if (!problem) {
    return c.text("problem not found", 404);
  }

  // if problem is found, set it to context
  c.set("problem", problem);
  await next();
};

const route = app.get(
  "/",
  validateHash,
  upgradeWebSocket((c) => {
    // problem was validated by validateHash middleware
    const problem: CompatibleProblem = c.get("problem");
    const task: Task = problem.runtime();

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
            str = new TextDecoder().decode(data as unknown as ArrayBuffer);
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
  })
);

export { route as wsRoute, injectWebSocket };