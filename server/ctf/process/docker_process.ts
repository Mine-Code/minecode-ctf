import { HostProcess } from "./host_process.js";

export class DockerProcess extends HostProcess {
  constructor(container_id: string, public command: string) {
    super(`docker exec -i ${container_id} stdbuf -i0 -o0 -e0 ${command}`);
  }
}
