import { IProcess } from "../process/index.js";
import { IWorker } from "../worker/index.js";

export { ProblemV1 } from "./problem_v1.js";

export type ProblemInitResult =
  | { result: "Success" }
  | { result: "InitializationTimeout" }
  | { result: "InitializationError"; exit_code: number };

export interface IProblem {
  getWorker(): IWorker;

  getHash(): string; // Returns a unique hash for the problem
  doInit(): Promise<ProblemInitResult>; // Initializes the problem. Optional, starts the daemon process

  spawnProblem(): IProcess;
}
