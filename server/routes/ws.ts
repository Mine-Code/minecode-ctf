import { Hono, type Next } from "hono";
import type { Context } from "hono";
import { WSMessageReceive } from "hono/ws";
import WebSocket from "ws";
import problems from "../datas/problem_manager";
import Problem from "../datas/problem/problem";
import { Task } from "../datas/problem/metadata/tasks/task/task";

type AppVariables = {
  problem: Problem;
};

const app = new Hono<{ Variables: AppVariables }>();

// validate hash param before upgrade to WebSocket
const validateHash = async (
  c: Context<{ Variables: AppVariables }>,
  next: Next
) => {
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
const route = app.get(
  "/",
  validateHash,
  (c) => {
    return c.text("WebSocket upgrade should be handled at server level", 400);
  }
);

export { route as wsRoute };
