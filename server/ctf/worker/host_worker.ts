import { IWorker } from ".";
import { IProcess, wait_for_process } from "../process";
import { HostProcess } from "../process";

export class HostWorker implements IWorker {
  processes: IProcess[] = [];
  constructor() {}

  async cleanup() {
    for (const p of this.processes) {
      p.kill();
      await wait_for_process(p, 5000);
    }
    this.processes = [];
  }

  spawn(cmdline: string): IProcess {
    const p = new HostProcess(cmdline);
    this.processes.push(p);
    return p;
  }
}
