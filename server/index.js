
import problemManager from "./server/datas/problem_manager.js";

let f = false;

async function ent() {
  await problemManager.initalizeAllProblems();
  console.log(problemManager.getProblemHashes());
  let p = problemManager.getProblemWithHash("a7d28a5b02b848d10b0d463ac2d88bf9");
  let r = p.runtime();
  r.writeStdin("test95039503905390539\n");
  r = await r;

  console.log("Done initalization");
  console.log("-----");
  console.log(r)
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
}, 1000)