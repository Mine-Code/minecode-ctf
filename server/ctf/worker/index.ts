import { IProcess } from "../process/index.js";

export { DockerWorker } from "./docker_worker.js";

export interface IWorker {
  spawn(cmdline: string): IProcess;
  cleanup(): Promise<void>; // Optional cleanup method
}
