import { spawn } from "child_process";
// type StringHandler = (string) => ();
// type EventHandler = () => ();
export default class RawProcessWrapper {
    cp;
    constructor(exec) {
        this.cp = spawn(exec, {
            shell: true,
            stdio: ["pipe", "pipe", "pipe"],
        });
    }
    writeStdin(data) {
        this.cp.stdin?.write(data);
    }
    onMessage(handler) {
        this.cp.stdout?.on("data", (data) => {
            handler(data);
        });
        this.cp.stderr?.on("data", (data) => {
            handler(data);
        });
        this.cp.on("data", (data) => {
            handler(data);
        });
    }
    onDisconnect(handler) {
        this.cp.on("exit", handler);
    }
    kill() {
        this.cp.kill();
    }
}
