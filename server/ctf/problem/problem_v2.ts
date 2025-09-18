import { IProblem, ProblemInitResult } from ".";
import { IWorker } from "../worker";
import { IProcess, wait_for_process } from "../process";
import { existsSync, readFileSync } from "fs";

const DOCKER_IMAGE_PREFIX = "mcctf/p2/";

type Metadata = {
  problem_id: string;
};

function loadMetadata(path: string): Metadata {
  // if not match raise error
  if (!existsSync(path)) {
    throw new Error("metadata.json not found");
  }

  try {
    const content = readFileSync(path, "utf-8");
    const object = JSON.parse(content);

    return {
      problem_id: object.problem_id,
    };
  } catch (e) {
    throw new Error("metadata.json is malformed");
  }
}

export class ProblemV2 implements IProblem {
  problem_id: string;
  image_id: string;

  constructor(private problem_path: string, private worker: IWorker) {
    const metadata = loadMetadata(`${problem_path}/metadata.json`);
    this.problem_id = metadata.problem_id;
    this.image_id = `${DOCKER_IMAGE_PREFIX}${this.problem_id}`;
  }

  getWorker(): IWorker {
    return this.worker;
  }

  getHash(): string {
    return this.problem_id;
  }

  async doInit(): Promise<ProblemInitResult> {
    console.log(`Initializing problem at ${this.problem_path}`);
    const p = this.worker.spawn(
      `docker build -t ${this.image_id} ${this.problem_path}`
    );
    p.onOut((data) => {
      console.log(`Build output: ${data}`);
    });

    const result = await wait_for_process(p, 3600 * 1000);
    if (result.success) return { result: "Success" };

    if (result.error_kind === "Timeout") {
      return { result: "InitializationTimeout" };
    } else if (result.error_kind === "ProcessExitedWithError") {
      return { result: "InitializationError", exit_code: result.exit_code };
    }

    // Unreachable
    throw new Error("Unreachable");
  }

  spawnProblem(): IProcess {
    return this.worker.spawn(`docker run --rm -i ${this.image_id}`);
  }
}
