import DockerWorker from "./docker_worker.js";

export class Task {
  output: string = "";
  exited: boolean = false;

  constructor(public worker: DockerWorker) {
    worker.onMessage((data) => {
      this.output += data;
    });
    worker.onDisconnect(() => {
      this.exited = true;
    })
  }
  writeStdin(data: string) {
    this.worker.writeStdin(data);
  }
  onMessage(handler: (data: string) => void) {
    if (this.output) {
      handler(this.output);
    }
    this.worker.onMessage(handler);
  }
  onDisconnect(handler: () => void) {
    if (this.exited) {
      handler();
      return;
    }
    this.worker.onDisconnect(handler);
  }
  checkOutputWithTimeout(timeout: number) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.output);
      }, timeout * 1000);
      this.worker.onDisconnect(() => resolve(this.output));
    })
  }
  checkOutput() {
    return new Promise((resolve) => {
      this.worker.onDisconnect(() => resolve(this.output));
    })
  }
  kill() {
    this.worker.kill();
  }
}

export default class TaskFactory {
  constructor(public problem_path: string, public command: string) {
    this.problem_path = problem_path;
    this.command = command;
  }

  execute(timeout: number = 2) {
    let worker = new DockerWorker(this.problem_path, this.command);

    return new Task(worker);
  }
}