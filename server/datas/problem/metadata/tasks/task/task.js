import DockerWorker from "./docker_worker.js";

export default class Task {
  /** @argument {string} problem_path */
  /** @argument {string} command */
  constructor(problem_path, command) {
    /** @type {string} */
    this.problem_path = problem_path;

    /** @type {string} */
    this.command = command;
  }

  /** @returns {Promise<string> | {writeStdin: (string) => ()}} */
  execute() {
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

    let ret = {};
    ret.writeStdin = (data) => {
      worker.writeStdin(data);
    }
    ret.then = promise.then.bind(promise);

    return ret;
  }
}