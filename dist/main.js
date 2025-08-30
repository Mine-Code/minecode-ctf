import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { createServer } from "http";
import WebSocket, { WebSocketServer } from "ws";
import { apiRoute } from "./routes/api/index.js";
import problems from "./datas/problem_manager.js";
const app = new Hono();
app.route("/api", apiRoute);
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
// Create HTTP server using Hono's built-in serve
const server = createServer();
// Use Hono's serve function to handle requests
serve({
    fetch: app.fetch,
    port,
}, (info) => {
    console.log(`Server is running on port ${info.port}`);
});
// Create WebSocket server on the same port
const wss = new WebSocketServer({ port: port + 1 });
wss.on("connection", (ws, request) => {
    const url = new URL(request.url, `http://${request.headers.host}`);
    const hash = url.searchParams.get("hash");
    if (!hash) {
        ws.close(1000, "hash is not specified");
        return;
    }
    const problem = problems.getProblemWithHash(hash);
    if (!problem) {
        ws.close(1000, "problem not found");
        return;
    }
    const task = problem.runtime();
    // Set up task message handling
    task.onMessage((data) => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(data);
        }
    });
    task.onDisconnect(() => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send("[Wrapper] The app has exited\n");
            ws.close();
        }
    });
    // Handle incoming WebSocket messages
    ws.on("message", (data) => {
        try {
            let str;
            if (typeof data === "string") {
                str = data;
            }
            else if (Buffer.isBuffer(data)) {
                str = data.toString();
            }
            else {
                str = data.toString();
            }
            task.writeStdin(str);
        }
        catch (error) {
            console.error("Failed to process WebSocket message:", error);
        }
    });
    ws.on("close", () => {
        task.kill();
    });
    ws.on("error", (error) => {
        console.error("WebSocket error:", error);
        task.kill();
    });
});
console.log(`WebSocket server is running on port ${port + 1}`);
