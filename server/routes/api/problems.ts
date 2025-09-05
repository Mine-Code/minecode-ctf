import { Hono } from "hono";
import problems from "../../datas/problem_manager.js";

const app = new Hono();

const route = app.get("/", async (c) => {
  const hashes = problems.getProblemHashes();

  return c.json({
    status: "ok",
    data: hashes,
  });
});

export { route as problemsRoute };
