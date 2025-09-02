import { HostProcess } from "../../ctf";
export default class Problem {
    super_problem;
    constructor(super_problem) {
        this.super_problem = super_problem;
    }
    init() {
        return this.super_problem.doInit();
    }
    runtime() {
        return this.super_problem.spawnProblem();
    }
    daemon() {
        // dummy process
        const process = new HostProcess("sleep 9999999999");
        return process;
    }
}
