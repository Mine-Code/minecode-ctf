import Task from "./task/task.js";
export default class Tasks {
    init;
    runtime;
    daemon;
    constructor(problem_path, obj) {
        if (!obj.init) {
            throw new Error("Problem init task is not specified or empty");
        }
        this.init = new Task(problem_path, obj.init);
        if (!obj.runtime) {
            throw new Error("Problem runtime task is not specified or empty");
        }
        this.runtime = new Task(problem_path, obj.runtime);
        if (!obj.daemon) {
            throw new Error("Problem daemon task is not specified or empty");
        }
        this.daemon = new Task(problem_path, obj.daemon);
    }
}
