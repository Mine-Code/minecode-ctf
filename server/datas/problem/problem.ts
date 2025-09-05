import { HostProcess, ProblemV1 as SuperProblem } from "../../ctf/index.js";

export default class Problem {
  constructor(public super_problem: SuperProblem) {}

  init() {
    return this.super_problem.doInit();
  }

  runtime() {
    return this.super_problem.spawnProblem();
  }

  daemon() {
    // dummy process
    const process = new HostProcess("sleep 9999999999");

    return process;
  }
}
