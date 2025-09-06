import { type Next } from "hono";
import type { Context } from "hono";
import problems from "../datas/problem_manager";
import { Task } from "../datas/problem/metadata/tasks/task/task";

type CompatibleProblem = {
  runtime: () => Task;
};

type AppVariables = {
  problem: CompatibleProblem;
};

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

export { validateHash };