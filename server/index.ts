import problemManager from "./datas/problem_manager";

let f = false;

async function ent() {
  await problemManager.initalizeAllProblems();
  console.log(problemManager.getProblemHashes());
  let p = problemManager.getProblemWithHash("c54bc07541eae5a7ece61fbce94c1466");
  if (p) {
    let task = p.runtime();
    task.writeStdin("test\n");

    console.log("Done initalization");
    console.log("-----");
    console.log(task);
    console.log("-----");
  } else {
    console.log("Problem not found");
  }

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
