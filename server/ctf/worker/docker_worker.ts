import { join } from "path";
import { IWorker } from ".";
import { IProcess, wait_for_process } from "../process";
import { HostProcess, DockerProcess } from "../process";

export class DockerWorker implements IWorker {
  private docker_container_id: string | null = null;
  private problem_base: string;
  constructor(private docker_image: string, problem_path: string) {
    this.problem_base = join(process.cwd(), problem_path);
  }

  async init() {
    // run container and get id
    const p = new HostProcess(
      `docker run -v ${this.problem_base}:/mnt -di --rm ${this.docker_image} sleep infinity`
    );
    p.onOut((data) => {
      const match = data.toString().trim();
      if (match) {
        this.docker_container_id = match;
        console.log(
          `Docker container started with ID: ${this.docker_container_id}`
        );
      }
    });

    await wait_for_process(p, 5000);
  }

  async cleanup() {
    if (this.docker_container_id) {
      const p = new HostProcess(
        `docker container kill ${this.docker_container_id}`
      );
      p.onOut((data) => {
        console.log(`Docker container stopped: ${data}`);
      });

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
