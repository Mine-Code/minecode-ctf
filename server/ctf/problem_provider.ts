import { normalize } from "path";
import { IProblem, ProblemV1 } from "./problem";
import { DockerWorker } from "./worker";
import { existsSync } from "fs";
export type ProblemProvider = () => Promise<IProblem[]>;

// MC-CTF の問題形式に則っているかを検査する
function isMineCodeCTFProblem(basepath: string): boolean {
  return (
    existsSync(basepath) &&
    existsSync(`${basepath}/.mc_ctf/daemon.sh`) &&
    existsSync(`${basepath}/.mc_ctf/init.sh`) &&
    existsSync(`${basepath}/.mc_ctf/runtime.sh`)
  );
}

export const problemFromEnv = async () => {
  const envProblems = process.env.PROBLEMS ?? "";
  const problemBasepaths = envProblems
    .split(",")
    .filter((x) => !x.includes(".."))
    .map((x) => normalize(x.trim()))
    .filter((x) => x !== "" && isMineCodeCTFProblem(x));

  let problems: IProblem[] = [];

  for (const basepath of problemBasepaths) {
    console.group(`Loading problem from ${basepath}`);

    const worker = new DockerWorker("minecode-ctf-runner", basepath);
    await worker.init();

    const problem = new ProblemV1(basepath, worker);
    await problem.doInit();

    console.groupEnd();
    problems.push(problem);
  }

  return problems;
};
