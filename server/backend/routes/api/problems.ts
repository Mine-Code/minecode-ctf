import { Context } from "@kapsonfire/bun-bakery"
import problems from "../../../datas/problem_manager";

export async function GET(ctx: Context) {
  const hashes = problems.getProblemHashes();

  ctx.sendResponse(
    new Response(
      JSON.stringify({
        status: "ok",
        data: hashes,
      })
    )
  );
}