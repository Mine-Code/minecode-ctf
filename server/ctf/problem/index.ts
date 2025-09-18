import { IProcess } from "../process";
import { IWorker } from "../worker";

export { ProblemV1 } from "./problem_v1";
export { ProblemV2 } from "./problem_v2";

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
