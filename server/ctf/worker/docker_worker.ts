import { join } from "path";
import { IWorker } from ".";
import { IProcess, wait_for_process } from "../process";
import { HostProcess, DockerProcess } from "../process";

export type DockerWorkerInitResult =
  | { kind: "Success" }
  | { kind: "Timeout" }
  | { kind: "DockerRunFailed"; output: string; exit_code: number }
  | { kind: "OutputMalformed"; output: string };

export class DockerWorker implements IWorker {
  private docker_container_id: string | null = null;
  private problem_base: string;
  constructor(private docker_image: string, problem_path: string) {
    this.problem_base = join(process.cwd(), problem_path);
  }

  async init(): Promise<DockerWorkerInitResult> {
    const p = new HostProcess(
      `docker run -v ${this.problem_base}:/mnt -di --rm ${this.docker_image} sleep infinity`
    );

    let output = "";
    p.onOut((data) => {
      output += data;
    });

    const result = await wait_for_process(p, 5000);
    if (result.kind === "Timeout") {
      return { kind: "Timeout" };
    } else if (result.kind === "ProcessExitedWithError") {
      return {
        kind: "DockerRunFailed",
        output: output,
        exit_code: result.exit_code,
      };
    }

    // コンテナIDは64文字の英数字
    if (!output.trim().match(/^[a-z0-9]{64}$/)) {
      return {
        kind: "OutputMalformed",
        output: output,
      };
    }

    this.docker_container_id = output.trim();
    console.log(
      `Docker container started with ID: ${this.docker_container_id}`
    );
    return { kind: "Success" };
  }

  async cleanup() {
    if (this.docker_container_id) {
      const p = new HostProcess(
        `docker container kill ${this.docker_container_id}`
      );
      await wait_for_process(p, 5000);
      this.docker_container_id = null;
      console.log("Docker container closed successfully.");
    } else {
      console.warn("No Docker container to close.");
    }
  }

  spawn(cmdline: string): IProcess {
    if (!this.docker_container_id) {
      throw new Error("Docker container is not initialized");
    }
    return new DockerProcess(this.docker_container_id, cmdline);
  }
}
