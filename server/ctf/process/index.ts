export { DockerProcess } from "./docker_process";
export { HostProcess } from "./host_process";

export interface IProcess {
  writeIn(text: string): void;
  onOut(handler: (data: string) => void): void;
  onExit(handler: (code: number) => void): void;
  kill(): void;
}

export function wait_for_process(
  process: IProcess,
  timeout: number = 10000
): Promise<void> {
  return new Promise((resolve, reject) => {
    let timer: number | null = null;
    process.onExit((code) => {
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }

      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Process exited with code ${code}`));
      }
    });
    timer = setTimeout(() => {
      process.kill();
      reject(new Error("Process timed out"));
    }, timeout);
  });
}
