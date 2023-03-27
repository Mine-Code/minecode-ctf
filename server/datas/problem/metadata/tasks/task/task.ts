import DockerWorker from "./docker_worker.js";


export default class TaskFactory {
  constructor(public problem_path: string, public command: string) {
    this.problem_path = problem_path;
    this.command = command;
  }

  execute(timeout: number = 2) {
    let worker = new DockerWorker(this.problem_path, this.command);
    let output = "";
    worker.onMessage((data) => {
      output += data;
    });

    let promise = new Promise((resolve) => {
      worker.onDisconnect(() => {
        resolve(output);
      });
    });

    return {
      writeStdin(data: string) {
        worker.writeStdin(data);
      },
      onMessage(handler: (data: string) => void) {
        worker.onMessage(handler);
      },
      checkOutputWithTimeout(timeout: number): Promise<string> {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(output);
          }, timeout * 1000);
          worker.onDisconnect(() => resolve(output));
        })
      },
      check_output(): Promise<string> {
        return new Promise((resolve) => {
          worker.onDisconnect(() => resolve(output));
        });
      }
    };
  }
}