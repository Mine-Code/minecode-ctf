import { Hono } from "hono";
import { ProblemManager } from "../../ctf";

const app = new Hono<{
  Variables: {
    problems: ProblemManager;
  };
}>();

export const route = app.get("/", async (c) => {
  const problems: ProblemManager = c.get("problems");
  const problemList = Object.keys(problems.getProblems());

  return c.json({
    status: "ok",
    data: problemList,
  });
});
