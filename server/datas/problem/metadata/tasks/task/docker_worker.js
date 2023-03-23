/** @typedef {(String)=>()} StringHandler */
/** @typedef {()=>()} EventHandler */

import { join } from "path";

import RawProcessWrapper from "./raw_process_wrapper.js";

export default class DockerWorker {
  /**
   * @argument {string} problem_path
   * @argument {string} command
   */
  constructor(problem_path, command) {
    this.cp = new RawProcessWrapper(`docker run -v ${join(process.cwd(), problem_path)}:/mnt -i --rm minecode-ctf-runner ${command}`);

    /** @type {string[]} */
    this.buffer = [];

    /** @type {number | null} */
    this.return_code = null;

    this.cp.onMessage((data_) => {
      const data = data_.toString();
      this.buffer.push(data);
    });
  }

  writeStdin(/** @type {String} */ data) {
    this.cp.writeStdin(data);
  }

  onMessage(/** @type {StringHandler} */ handler) {
    for (const data of this.buffer) {
      handler(data);
    }
    this.cp.onMessage(handler);
  }

  onDisconnect(/** @type {EventHandler} */ handler) {
    this.cp.onDisconnect(handler);
  }
}