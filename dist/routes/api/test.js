import { Hono } from "hono";
import problems from "../../datas/problem_manager.js";
const app = new Hono();
const route = app.get("/", async (c) => {
    const hash = c.req.query("hash");
    const raw_input = c.req.query("raw_input");
    if (!hash) {
        return c.json({
            status: "error",
            error: "No App has selected.",
        }, 400);
    }
    if (!raw_input) {
        return c.json({
            status: "error",
            error: "No input has specified.",
        }, 400);
    }
    const problem = problems.getProblemWithHash(hash);
    if (!problem) {
        return c.json({
            status: "error",
            error: "Unknown App has selected.",
        }, 400);
    }
    let _input = "";
    try {
        _input = JSON.parse(`"${raw_input}"`);
    }
    catch (e) {
        return c.json({
            status: "error",
            error: "Invalid Input",
        }, 400);
        return;
    }
    const input = _input;
    const task = problem.runtime();
    task.writeStdin(input);
    const output = await task.checkOutputWithTimeout(2);
    return c.json({
        status: "ok",
        output,
    });
});
export { route as testRoute };
