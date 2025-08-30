import { IProcess } from "../process";

export { DockerWorker } from "./docker_worker";

export interface IWorker {
  spawn(cmdline: string): IProcess;
  cleanup(): Promise<void>; // Optional cleanup method
}
