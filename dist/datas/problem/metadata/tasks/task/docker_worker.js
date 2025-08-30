import { join } from "path";
import RawProcessWrapper from "./raw_process_wrapper.js";
export default class DockerWorker {
    problem_path;
    command;
    cp;
    buffer;
    return_code;
    constructor(problem_path, command) {
        this.problem_path = problem_path;
        this.command = command;
        this.cp = new RawProcessWrapper(`docker run -v ${join(process.cwd(), problem_path)}:/mnt -i --rm minecode-ctf-runner stdbuf -i0 -o0 -e0 ${command}`);
        this.buffer = [];
        this.return_code = null;
        this.cp.onMessage((data_) => {
            const data = data_.toString();
            this.buffer.push(data);
        });
    }
    writeStdin(data) {
        this.cp.writeStdin(data);
    }
    onMessage(handler) {
        for (const data of this.buffer) {
            handler(data);
        }
        this.cp.onMessage(handler);
    }
    onDisconnect(handler) {
        this.cp.onDisconnect(handler);
    }
    kill() {
        this.cp.kill();
    }
}
