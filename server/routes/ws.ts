import { Hono, type Next } from "hono";
import type { Context } from "hono";
import { createNodeWebSocket } from "@hono/node-ws";
import { WSMessageReceive } from "hono/ws";
import { IProblem, ProblemManager } from "../ctf";

type AppVariables = {
  problem: IProblem;
  problems: ProblemManager;
};

export function registerRoutes({
  app,
  problems,
}: {
  app: Hono<{ Variables: AppVariables }>;
  problems: ProblemManager;
}) {
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

    const problem = problems.getProblemByHash(hash);
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
      const problem: IProblem = c.get("problem");
      const task = problem.spawnProblem();

      return {
        onOpen: (_, ws) => {
          task.onOut((data) => ws.send(data));

          task.onExit(() => {
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
              // Convert ArrayBufferView to Uint8Array for TextDecoder
              const uint8Array = new Uint8Array(
                data.buffer,
                data.byteOffset,
                data.byteLength
              );
              str = new TextDecoder().decode(uint8Array);
            } else {
              console.warn("Received unsupported message type:", data);
              return;
            }
            task.writeIn(str);
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

  return {
    route,
    injectWebSocket,
  };
}
