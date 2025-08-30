import DockerWorker from "./docker_worker.js";
export class Task {
    worker;
    output = "";
    exited = false;
    constructor(worker) {
        this.worker = worker;
        worker.onMessage((data) => {
            this.output += data;
        });
        worker.onDisconnect(() => {
            this.exited = true;
        });
    }
    writeStdin(data) {
        this.worker.writeStdin(data);
    }
    onMessage(handler) {
        if (this.output) {
            handler(this.output);
        }
        this.worker.onMessage(handler);
    }
    onDisconnect(handler) {
        if (this.exited) {
            handler();
            return;
        }
        this.worker.onDisconnect(handler);
    }
    checkOutputWithTimeout(timeout) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.output);
            }, timeout * 1000);
            this.worker.onDisconnect(() => resolve(this.output));
        });
    }
    checkOutput() {
        return new Promise((resolve) => {
            this.worker.onDisconnect(() => resolve(this.output));
        });
    }
    kill() {
        this.worker.kill();
    }
}
export default class TaskFactory {
    problem_path;
    command;
    constructor(problem_path, command) {
        this.problem_path = problem_path;
        this.command = command;
        this.problem_path = problem_path;
        this.command = command;
    }
    execute(timeout = 2) {
        let worker = new DockerWorker(this.problem_path, this.command);
        return new Task(worker);
    }
}
