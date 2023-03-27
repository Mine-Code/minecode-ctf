import { Context } from "@kapsonfire/bun-bakery";
import { ServerWebSocket } from "bun";

export const WEBSOCKET = {
  open: (ws: ServerWebSocket) => {
    console.log('OPEN');
  },
  message: (ws: ServerWebSocket, message: string) => {
    console.log('RCV:', message);
    ws.send(`ECHO: ${message}`);
  },
  upgrade: (ctx: Context) => {
    ctx.acceptWebsocketUpgrade();
  }
}