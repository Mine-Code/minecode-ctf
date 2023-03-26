import Problem from "./problem.js";
import { createHash } from "crypto";
class ProblemManager {
  constructor() {
    this.problem_paths = process.env.PROBLEMS.split(",");

    this.problems = this.problem_paths.map(x => new Problem(x));
  }

  getCurrentProblems() {
    return this.problems;
  }

  getProblemHashes() {
    const arr = this.problems.map(x => [x.metadata.name, createHash("MD5").update(x.problem_path).digest("hex")]);
    return Object.fromEntries(arr);
  }

  /**
   *
   * @param {string} hash problem_path hash(MD5)
   */
  getProblemWithHash(hash) {
    return this.problems.find(x => createHash("MD5").update(x.problem_path).digest("hex") === hash);
  }

  initalizeAllProblems() {
    return Promise.all(this.problems.map(x => x.init()));
  }
}

const manager = new ProblemManager();

export default manager;