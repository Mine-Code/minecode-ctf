import { Hono } from "hono";
import problems from "../datas/problem_manager";
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
// For now, provide a placeholder WebSocket upgrade route
// This will need to be handled at the server level with a WebSocket server
const route = app.get("/", validateHash, (c) => {
    return c.text("WebSocket upgrade should be handled at server level", 400);
});
export { route as wsRoute };
