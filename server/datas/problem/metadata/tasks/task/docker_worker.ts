import { join } from "path";

import RawProcessWrapper from "./raw_process_wrapper.js";

export default class DockerWorker {
  private cp: RawProcessWrapper;
  private buffer: string[];
  private return_code: number | null;

  constructor(public problem_path: string, public command: string) {
    this.cp = new RawProcessWrapper(`docker run -v ${join(process.cwd(), problem_path)}:/mnt -i --rm minecode-ctf-runner ${command}`);

    this.buffer = [];

    this.return_code = null;

    this.cp.onMessage((data_) => {
      const data = data_.toString();
      this.buffer.push(data);
    });
  }

  writeStdin(data: string) {
    this.cp.writeStdin(data);
  }

  onMessage(handler: (data: string) => void) {
    for (const data of this.buffer) {
      handler(data);
    }
    this.cp.onMessage(handler);
  }

  onDisconnect(handler: () => void) {
    this.cp.onDisconnect(handler);
  }
}