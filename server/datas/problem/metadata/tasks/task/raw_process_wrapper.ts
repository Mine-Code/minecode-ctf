import { spawn, ChildProcess, ChildProcessByStdio } from "child_process";

// type StringHandler = (string) => ();
// type EventHandler = () => ();

export default class RawProcessWrapper {
  private cp: ChildProcess;

  constructor(exec: string) {
    this.cp = spawn(exec, {
      shell: true,
      stdio: ["pipe", "pipe", "pipe"],
    });
  }

  writeStdin(data: string) {
    this.cp.stdin?.write(data);
  }

  onMessage(handler: (data: string) => void) {
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

  onDisconnect(handler: () => void) {
    this.cp.on("exit", handler);
  }
  kill() {
    this.cp.kill();
  }
}