import { IProcess } from "../process";
import { IWorker } from "../worker";

export { ProblemV1 } from "./problem_v1";

export interface IProblem {
  getWorker(): IWorker;

  getHash(): string; // Returns a unique hash for the problem
  doInit(): Promise<void>; // Initializes the problem. Optional, starts the daemon process

  spawnProblem(): IProcess;
}
