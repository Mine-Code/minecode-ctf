import { IProblem } from "../../../../ctf";
import Task from "./task/task";

export default class Tasks {
  public runtime: Task;
  constructor(problem: IProblem) {
    this.runtime = new Task(problem);
  }
}
