import { HostProcess } from "./host_process";
export class DockerProcess extends HostProcess {
    command;
    constructor(container_id, command) {
        super(`docker exec -i ${container_id} stdbuf -i0 -o0 -e0 ${command}`);
        this.command = command;
    }
}
