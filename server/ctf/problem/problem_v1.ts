import { createHash } from "crypto";
import { IProblem, ProblemInitResult } from ".";
import { IWorker } from "../worker";
import { IProcess, wait_for_process } from "../process";

export class ProblemV1 implements IProblem {
  problem_hash: string;
  daemon_process: IProcess | null = null;

  constructor(private problem_path: string, private worker: IWorker) {
    this.problem_hash = createHash("MD5").update(problem_path).digest("hex");
  }

  getWorker(): IWorker {
    return this.worker;
  }

  getHash(): string {
    return this.problem_hash;
  }

  async doInit(): Promise<ProblemInitResult> {
    console.log(`Initializing problem at ${this.problem_path}`);
    const p = this.worker.spawn("/mnt/.mc_ctf/init.sh");
    p.onOut((data) => {
      console.log(`Init output: ${data}`);
    });

    const initWaitingResult = await wait_for_process(p, 10000);
    if (initWaitingResult.kind === "Timeout") {
      console.error("Problem initialization timed out.");
      return { result: "InitializationTimeout" };
    } else if (initWaitingResult.kind === "ProcessExitedWithError") {
      console.error("Problem initialization failed with an error.");
      return {
        result: "InitializationError",
        exit_code: initWaitingResult.exit_code,
      };
    }

    this.daemon_process = this.worker.spawn("/mnt/.mc_ctf/daemon.sh");
    this.daemon_process.onOut((data) => {
      console.log(`Daemon output: ${data}`);
    });

    return { result: "Success" };
  }

  spawnProblem(): IProcess {
    return this.worker.spawn("/mnt/.mc_ctf/runtime.sh");
  }
}
