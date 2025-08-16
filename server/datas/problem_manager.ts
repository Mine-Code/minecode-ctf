import { IProblem } from "../ctf";
import { ProblemManager as Super } from "../ctf/problem_manager.js";
import { problemFromEnv } from "../ctf/problem_provider.js";
import { Task } from "./problem/metadata/tasks/task/task";

function problem_compatible_layer(super_problem: IProblem) {
  return {
    runtime: () => {
      return new Task(super_problem.spawnProblem());
    },
  };
}

class ProblemManager {
  super_manager: Super;

  constructor() {
    this.super_manager = new Super(problemFromEnv);

    this.super_manager
      .init()
      .then(() => {
        console.log(
          "ProblemManager initialized with problems:",
          this.getProblemHashes()
        );
      })
      .catch((error) => {
        console.error("Error initializing ProblemManager:", error);
      });
  }

  getCurrentProblems() {
    const problems = this.super_manager.getProblems();

    const problem_objects: { [hash: string]: any } = {};
    for (const hash in problems) {
      const super_problem = problems[hash];
      const problem_object = problem_compatible_layer(super_problem);
      problem_objects[hash] = problem_object;
    }

    return problem_objects;
  }

  getProblemHashes() {
    const problems = this.super_manager.getProblems();
    return Object.keys(problems);
  }

  getProblemWithHash(hash: string) {
    const problem = this.super_manager.getProblemByHash(hash);
    return problem ? problem_compatible_layer(problem) : null;
  }

  async initalizeAllProblems() {
    await this.super_manager.init();
  }
}

const manager = new ProblemManager();

export default manager;
