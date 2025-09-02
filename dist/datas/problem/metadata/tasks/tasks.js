import Task from "./task/task";
export default class Tasks {
    runtime;
    constructor(problem) {
        this.runtime = new Task(problem);
    }
}
