import problemManager from "./datas/problem_manager";

let f = false;

async function ent() {
  await problemManager.initalizeAllProblems();
  console.log(problemManager.getProblemHashes());
  let p = problemManager.getProblemWithHash("c54bc07541eae5a7ece61fbce94c1466");
  let r = p.runtime();
  r.writeStdin("test\n");
  r = await r;

  console.log("Done initalization");
  console.log("-----");
  console.log(r);
  console.log("-----");

  f = true;
}

ent();

setInterval(() => {
  if (f === false) {
    console.log("waiting...");
  }
  if (f === true) {
    console.log("done!");
    process.exit(0);
  }
}, 1000);
