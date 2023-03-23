import { spawn } from "child_process";

/** @typedef {(String)=>()} StringHandler */
/** @typedef {()=>()} EventHandler */

export default class RawProcessWrapper {

  /** @argument {String} exec */
  constructor(exec) {
    /** @public */
    this.cp = spawn(exec, {
      shell: true
    });
  }

  writeStdin(/** @type {String} */ data) {
    this.cp.stdin.write(data);
  }

  onMessage(/** @type {StringHandler} */ handler) {
    this.cp.stdout.on("data", (data) => {
      handler(data);
    });
    this.cp.stderr.on("data", (data) => {
      handler(data);
    });
    this.cp.on("data", (data) => {
      handler(data);
    });
  }

  onDisconnect(/** @type {EventHandler} */ handler) {
    this.cp.on("exit", handler);
  }
}