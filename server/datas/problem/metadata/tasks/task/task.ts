import { DockerWorker, IProblem, IProcess, IWorker } from "../../../../../ctf/index.js";

export class Task {
  output: string = "";
  exited: boolean = false;

  constructor(public worker: IProcess) {
    worker.onOut((data) => {
      this.output += data;
    });
    worker.onExit(() => {
      this.exited = true;
    });
  }
  writeStdin(data: string) {
    this.worker.writeIn(data);
  }
  onMessage(handler: (data: string) => void) {
    if (this.output) {
      handler(this.output);
    }
    this.worker.onOut(handler);
  }
  onDisconnect(handler: () => void) {
    if (this.exited) {
      handler();
      return;
    }
    this.worker.onExit(handler);
  }
  checkOutputWithTimeout(timeout: number) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.output);
      }, timeout * 1000);
      this.worker.onExit(() => resolve(this.output));
    });
  }
  checkOutput() {
    return new Promise((resolve) => {
      this.worker.onExit(() => resolve(this.output));
    });
  }
  kill() {
    this.worker.kill();
  }
}

export default class TaskFactory {
  constructor(public problem: IProblem) {}

  execute() {
    return new Task(this.problem.spawnProblem());
  }
}
