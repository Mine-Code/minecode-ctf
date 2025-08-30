import { Hono } from "hono";
import { apiRoute } from "./routes/api";
import { wsRoute, websocket } from "./routes/ws";

const app = new Hono();

app.route("/api", apiRoute).route("/ws", wsRoute);

export default {
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  fetch: app.fetch,
  websocket,
};
