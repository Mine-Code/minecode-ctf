import { Context } from "@kapsonfire/bun-bakery"
import problems from "../../../datas/problem_manager";

export async function GET(ctx: Context) {
  const url = new URL(ctx.request.url);
  const hash = url.searchParams.get("hash");
  const raw_input = url.searchParams.get("raw_input");
  if (!hash) {
    ctx.sendResponse(
      new Response(
        JSON.stringify({
          status: "error",
          error: "No App has selected.",
        }), {
        status: 400,
      })
    )
    return;
  }

  if (!raw_input) {
    ctx.sendResponse(
      new Response(
        JSON.stringify({
          status: "error",
          error: "No input has specified.",
        }), {
        status: 400,
      }
      )
    );
    return;
  }

  const problem = problems.getProblemWithHash(hash);
  if (!problem) {
    ctx.sendResponse(
      new Response(
        JSON.stringify({
          status: "error",
          error: "Unknown App has selected.",
        }), {
        status: 400,
      })
    )
    return;
  }


  let _input = "";

  try {
    _input = JSON.parse(`"${raw_input}"`);
  } catch (e) {
    ctx.sendResponse(
      new Response(
        JSON.stringify({
          status: "error",
          error: "Invalid Input",
        }), {
        status: 400,
      })
    )
    return;
  }
  const input = _input;

  const task = problem.runtime();
  task.writeStdin(input);

  const output = await task.checkOutputWithTimeout(2);

  ctx.sendResponse(
    new Response(
      JSON.stringify({
        status: "ok",
        output,
      })
    )
  );
}