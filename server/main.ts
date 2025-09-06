import { Hono } from "hono";
import { serve } from '@hono/node-server';
import { apiRoute } from "./routes/api";
import { registerRoutes as registerWSRoutes } from "./routes/ws";
import { Task } from "./datas/problem/metadata/tasks/task/task";

const app = new Hono<{Variables:{problem:{runtime:()=>Task}}}>();
const {route: wsRoute, injectWebSocket} = registerWSRoutes(app);

app.route("/api", apiRoute)
  .route("/ws", wsRoute);

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

console.log(`Starting server on port ${port}`);
const server = serve({
  fetch: app.fetch,
  port: port,
});

injectWebSocket(server);
