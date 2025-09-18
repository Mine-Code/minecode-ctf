import { normalize } from "path";
import { IProblem, ProblemV1, ProblemV2 } from "./problem";
import { DockerWorker } from "./worker";
import { existsSync } from "fs";
import { glob } from "glob";
import { HostWorker } from "./worker/host_worker";

export type ProblemProvider = () => Promise<IProblem[]>;

// MC-CTF の問題形式に則っているかを検査する
function isMineCodeCTFProblemV1(basepath: string): boolean {
  return (
    existsSync(basepath) &&
    existsSync(`${basepath}/.mc_ctf/daemon.sh`) &&
    existsSync(`${basepath}/.mc_ctf/init.sh`) &&
    existsSync(`${basepath}/.mc_ctf/runtime.sh`)
  );
}

// MC-CTF の V2 問題形式に則っているかを検査する
function isMineCodeCTFProblemV2(basepath: string): boolean {
  return existsSync(basepath) && existsSync(`${basepath}/Dockerfile`);
}

export const problemFromEnv = async () => {
  const envProblems = process.env.PROBLEMS ?? "";
  const problemBasepaths = envProblems
    .split(",")
    .filter((x) => !x.includes(".."))
    .map((x) => normalize(x.trim()))
    .filter((x) => x !== "" && isMineCodeCTFProblemV1(x));

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

export const problemV2_FindAll = async () => {
  console.log("Finding ProblemV2 problems...");
  const problem_v2_path = process.env.PROBLEM_V2_PATH ?? "";
  console.log(`PROBLEM_V2_PATH=${problem_v2_path}`);

  const detected_metadatas = await glob(`${problem_v2_path}/*/metadata.json`, {
    nodir: true,
  });

  if (detected_metadatas.length === 0) {
    console.warn(
      `No ProblemV2 found in ${problem_v2_path}. Please set PROBLEM_V2_PATH environment variable correctly.`
    );
    return [];
  }

  // ProblemV2 の要求する構造と isMineCodeCTFProblem の条件は相違するのでチェックはしない
  const problemBasepaths = detected_metadatas
    .filter((x) => !x.includes(".."))
    .map((x) => normalize(x.replace(/\/metadata\.json$/, "")))
    .filter((x) => x !== "" && isMineCodeCTFProblemV2(x));

  let problems: IProblem[] = [];
  const worker = new HostWorker();

  for (const basepath of problemBasepaths) {
    console.group(`Loading problem from ${basepath} as ProblemV2`);

    const problem = new ProblemV2(basepath, worker);
    await problem.doInit();

    console.groupEnd();
    problems.push(problem);
  }

  return problems;
};
