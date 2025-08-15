import { IProblem, ProblemV1 } from "./problem";
import { DockerWorker } from "./worker";
export type ProblemProvider = () => Promise<IProblem[]>;

export const problemFromEnv = async () => {
  const env_problems = process.env.PROBLEMS ?? "";
  const problem_basepaths = env_problems
    .split(",")
    .filter((x) => x.trim() !== "");

  let problems: IProblem[] = [];

  for (const basepath of problem_basepaths) {
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
