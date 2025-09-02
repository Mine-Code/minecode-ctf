import { createHash } from "crypto";
import { wait_for_process } from "../process";
export class ProblemV1 {
    problem_path;
    worker;
    problem_hash;
    daemon_process = null;
    constructor(problem_path, worker) {
        this.problem_path = problem_path;
        this.worker = worker;
        this.problem_hash = createHash("MD5").update(problem_path).digest("hex");
    }
    getWorker() {
        return this.worker;
    }
    getHash() {
        return this.problem_hash;
    }
    async doInit() {
        console.log(`Initializing problem at ${this.problem_path}`);
        const p = this.worker.spawn("/mnt/.mc_ctf/init.sh");
        p.onOut((data) => {
            console.log(`Init output: ${data}`);
        });
        const initWaitingResult = await wait_for_process(p, 10000);
        if (!initWaitingResult.success) {
            if (initWaitingResult.error_kind === "Timeout") {
                console.error("Problem initialization timed out.");
                return { result: "InitializationTimeout" };
            }
            else if (initWaitingResult.error_kind === "ProcessExitedWithError") {
                console.error("Problem initialization failed with an error.");
                return {
                    result: "InitializationError",
                    exit_code: initWaitingResult.exit_code,
                };
            }
        }
        this.daemon_process = this.worker.spawn("/mnt/.mc_ctf/daemon.sh");
        this.daemon_process.onOut((data) => {
            console.log(`Daemon output: ${data}`);
        });
        return { result: "Success" };
    }
    spawnProblem() {
        return this.worker.spawn("/mnt/.mc_ctf/runtime.sh");
    }
}
