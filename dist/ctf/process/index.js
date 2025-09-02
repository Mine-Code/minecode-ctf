export { DockerProcess } from "./docker_process";
export { HostProcess } from "./host_process";
export function wait_for_process(process, timeout = 10000) {
    return new Promise((resolve, reject) => {
        let timer = null;
        process.onExit((code) => {
            if (timer !== null) {
                clearTimeout(timer);
                timer = null;
            }
            if (code === 0) {
                resolve({ success: true });
            }
            else {
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
