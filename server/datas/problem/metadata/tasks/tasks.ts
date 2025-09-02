import { IProblem } from "../../../../ctf/index.js";
import Task from "./task/task.js";

export default class Tasks {
  public runtime: Task;
  constructor(problem: IProblem) {
    this.runtime = new Task(problem);
  }
}
