import { Hono } from "hono";
import { createNodeWebSocket } from "@hono/node-ws";
import problems from "../datas/problem_manager";
const { upgradeWebSocket, injectWebSocket } = createNodeWebSocket({});
const app = new Hono();
// validate hash param before upgrade to WebSocket
const validateHash = async (c, next) => {
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
const route = app.get("/", validateHash, upgradeWebSocket((c) => {
    // problem was validated by validateHash middleware
    const problem = c.get("problem");
    const process = problem.runtime();
    return {
        onOpen: (_, ws) => {
            process.onOut((data) => ws.send(data));
            process.onErr((data) => ws.send(data));
            process.onExit(() => {
                ws.send("[Wrapper] The app has exited\n");
                ws.close();
            });
        },
        onMessage: async (event, _ws) => {
            const data = event.data;
            let str;
            try {
                if (typeof data === "string") {
                    str = data;
                }
                else if (data instanceof Blob) {
                    str = await data.text();
                }
                else if (data instanceof ArrayBuffer) {
                    str = new TextDecoder().decode(data);
                }
                else if (ArrayBuffer.isView(data)) {
                    str = new TextDecoder().decode(data);
                }
                else {
                    console.warn("Received unsupported message type:", data);
                    return;
                }
                process.writeIn(str);
            }
            catch (error) {
                console.error("Failed to process WebSocket message:", error);
            }
        },
        onClose: () => {
            process.kill();
        },
        onError: (error) => {
            console.error("WebSocket error:", error);
            process.kill();
        },
    };
}));
export { route as wsRoute, injectWebSocket };
