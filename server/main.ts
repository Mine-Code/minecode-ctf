import { Hono } from "hono";
import { serve } from '@hono/node-server';
import { apiRoute } from "./routes/api";
import { wsRoute, injectWebSocket } from "./routes/ws";

const app = new Hono();

app.route("/api", apiRoute).route("/ws", wsRoute);

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

console.log(`Starting server on port ${port}`);
const server = serve({
  fetch: app.fetch,
  port: port,
});

injectWebSocket(server);
