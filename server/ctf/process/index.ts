export { DockerProcess } from "./docker_process";
export { HostProcess } from "./host_process";

export interface IProcess {
  writeIn(text: string): void;
  onOut(handler: (data: string) => void): void;
  onExit(handler: (code: number) => void): void;
  kill(): void;
}

type ProcessWaitResult =
  | { success: true }
  | { success: false; error_kind: "Timeout" }
  | { success: false; error_kind: "ProcessExitedWithError"; exit_code: number };

export function wait_for_process(
  process: IProcess,
  timeout: number = 10000
): Promise<ProcessWaitResult> {
  return new Promise((resolve, reject) => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    process.onExit((code) => {
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }

      if (code === 0) {
        resolve({ success: true });
      } else {
        resolve({
          success: false,
          error_kind: "ProcessExitedWithError",
          exit_code: code,
        });
      }
    });
    timer = setTimeout(() => {
      process.kill();
      timer = null;
      resolve({ success: false, error_kind: "Timeout" });
    }, timeout);
  });
}
