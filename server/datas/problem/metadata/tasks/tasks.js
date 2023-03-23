import Task from "./task/task.js";

export default class Tasks {
  /** @argument {string} problem_path */
  /** @argument {object} obj */
  constructor(problem_path, obj) {
    this.init = new Task(problem_path, obj.init);

    this.runtime = new Task(problem_path, obj.runtime);

    this.daemon = new Task(problem_path, obj.daemon);
  }
}