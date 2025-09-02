export class Task {
    worker;
    output = "";
    exited = false;
    constructor(worker) {
        this.worker = worker;
        worker.onOut((data) => {
            this.output += data;
        });
        worker.onExit(() => {
            this.exited = true;
        });
    }
    writeStdin(data) {
        this.worker.writeIn(data);
    }
    onMessage(handler) {
        if (this.output) {
            handler(this.output);
        }
        this.worker.onOut(handler);
    }
    onDisconnect(handler) {
        if (this.exited) {
            handler();
            return;
        }
        this.worker.onExit(handler);
    }
    checkOutputWithTimeout(timeout) {
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
    problem;
    constructor(problem) {
        this.problem = problem;
    }
    execute() {
        return new Task(this.problem.spawnProblem());
    }
}
