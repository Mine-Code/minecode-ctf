import { ProblemProvider } from "./index.js";
import { IProblem } from "./problem/index.js";

export class ProblemManager {
  private problems: { [hash: string]: IProblem } = {};

  constructor(private provider: ProblemProvider) {}

  async init() {
    const problems = await this.provider();
    this.problems = problems.reduce((acc, problem) => {
      acc[problem.getHash()] = problem;
      return acc;
    }, {} as { [hash: string]: IProblem });

    globalThis.process.on("SIGINT", async () => {
      console.log("Doing cleanup...");
      await this.cleanup();
      globalThis.process.exit(0);
    });
    globalThis.process.on("SIGTERM", async () => {
      console.log("Doing cleanup...");
      await this.cleanup();
      globalThis.process.exit(0);
    });
  }

  getProblems() {
    return this.problems;
  }

  getProblemByHash(hash: string): IProblem | null {
    return this.problems[hash] || null;
  }

  async cleanup() {
    for (const problem of Object.values(this.problems)) {
      await problem.getWorker().cleanup();
    }
  }
}
