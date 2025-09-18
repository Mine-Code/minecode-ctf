import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { apiRoute } from "./routes/api";
import { registerRoutes as registerWSRoutes } from "./routes/ws";
import { IProblem, ProblemManager } from "./ctf";
import { problemV2_FindAll } from "./ctf";
import { startTCPListener } from "./tcp_server/listener";

async function main() {
  const problem_manager = new ProblemManager(problemV2_FindAll);
  await problem_manager.init();

  const app = new Hono<{ Variables: { problem: IProblem } }>();
  const { route: wsRoute, injectWebSocket } = registerWSRoutes({
    app,
    problems: problem_manager,
  });

  app.route("/api", apiRoute).route("/ws", wsRoute);

  const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  console.log(`Starting server on port ${port}`);
  const server = serve({
    fetch: app.fetch,
    port: port,
  });

  injectWebSocket(server);

  console.log("Starting TCP listeners for problems...");
  startTCPListener(problem_manager);
}

main();
