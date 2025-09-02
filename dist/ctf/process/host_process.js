import { spawn } from "child_process";
export class HostProcess {
    cp;
    constructor(exec) {
        console.debug(`Spawning process: ${exec}`);
        this.cp = spawn(exec, {
            shell: true,
            stdio: ["pipe", "pipe", "pipe"],
        });
    }
    writeIn(data) {
        this.cp.stdin?.write(data);
    }
    onOut(handler) {
        this.cp.stdout?.on("data", (data) => {
            handler(data);
        });
        this.cp.stderr?.on("data", (data) => {
            handler(data);
        });
    }
    onExit(handler) {
        this.cp.on("exit", () => {
            if (this.cp.exitCode !== null) {
                handler(this.cp.exitCode);
            }
            else {
                console.error("Process exited without a code");
                handler(-1); // Indicate an error
            }
        });
    }
    kill() {
        this.cp.kill();
    }
}
