import { IProblem, ProblemManager } from "../ctf";
import { createServer } from "net";
import { PortManager } from "./manager";

function listener(problem: IProblem) {
  const server = createServer((sock) => {
    const proc = problem.spawnProblem();

    proc.onOut((data) => {
      sock.write(data);
    });
    sock.on("data", (data) => {
      proc.writeIn(data.toString());
    });
    proc.onExit(() => {
      sock.end();
    });
    sock.on("close", () => {
      proc.kill();
    });

    sock.on("error", (err) => {
      console.error("Socket error:", err);
      proc.kill();
    });
  });

  server.on("error", (err) => {
    console.error("Server error:", err);
  });

  return server;
}

export function startTCPListener(problems: ProblemManager) {
  const assigns = new PortManager();

  for (const problem_id in problems.getProblems()) {
    console.log(`Setting up TCP listener for problem ID: ${problem_id}`);

    const port = assigns.getPortForProblem(problem_id);
    const problem = problems.getProblemByHash(problem_id);

    if (!problem) {
      console.error(`Problem with ID ${problem_id} not found.`);
      continue;
    }

    listener(problem).listen(port, () => {
      console.log(
        `TCP server for problem ${problem_id} listening on port ${port}`
      );
    });
  }
}
