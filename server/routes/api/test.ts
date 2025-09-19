import { Hono } from "hono";
import { ProblemManager } from "../../ctf";

const app = new Hono<{
  Variables: {
    problems: ProblemManager;
  };
}>();

export const route = app.get("/", async (c) => {
  const problems: ProblemManager = c.get("problems");
  const hash = c.req.query("hash");
  const raw_input = c.req.query("raw_input");

  if (!hash) {
    return c.json(
      {
        status: "error",
        error: "No App has selected.",
      },
      400
    );
  }

  if (!raw_input) {
    return c.json(
      {
        status: "error",
        error: "No input has specified.",
      },
      400
    );
  }

  const problem = problems.getProblemByHash(hash);

  if (!problem) {
    return c.json(
      {
        status: "error",
        error: "Unknown App has selected.",
      },
      400
    );
  }

  let _input = "";

  try {
    _input = JSON.parse(`"${raw_input}"`);
  } catch (e) {
    return c.json(
      {
        status: "error",
        error: "Invalid Input",
      },
      400
    );
    return;
  }
  const input = _input;

  const task = problem.spawnProblem();
  task.writeIn(input);

  const output = await new Promise((resolve) => {
    let output = "";
    task.onOut((data) => {
      output += data;
    });
    task.onExit((code) => {
      resolve(output);
    });
  });

  return c.json({
    status: "ok",
    output,
  });
});
