import { ChildProcess, spawn } from "child_process";
import { IProcess } from ".";

export class HostProcess implements IProcess {
  private cp: ChildProcess;

  constructor(exec: string) {
    console.debug(`Spawning process: ${exec}`);
    this.cp = spawn(exec, {
      shell: true,
      stdio: ["pipe", "pipe", "pipe"],
    });
  }

  writeIn(data: string) {
    this.cp.stdin?.write(data);
  }

  onOut(handler: (data: string) => void) {
    this.cp.stdout?.on("data", (data) => {
      handler(data);
    });
    this.cp.stderr?.on("data", (data) => {
      handler(data);
    });
  }

  onExit(handler: (code: number) => void) {
    this.cp.on("exit", () => {
      if (this.cp.exitCode !== null) {
        handler(this.cp.exitCode);
      } else {
        console.error("Process exited without a code");
        handler(-1); // Indicate an error
      }
    });
  }
  kill() {
    this.cp.kill();
  }
}
