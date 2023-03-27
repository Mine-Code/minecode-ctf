import { Context } from "@kapsonfire/bun-bakery";
import { ServerWebSocket, WebSocketHandler } from "bun";
import { Task } from "../../../datas/problem/metadata/tasks/task/task";
import problems from "../../../datas/problem_manager";


export const WEBSOCKET = {
  open: (ws: ServerWebSocket) => {
    //@ts-ignore
    const task: Task = ws.data.task;

    task.onMessage((data) => {
      ws.send(data);
    });

    task.onDisconnect(() => {
      ws.send("[Wrapper] The app has exited\n");

      ws.close();
    });
  },
  message(ws: ServerWebSocket, message: string | Uint8Array) {
    //@ts-ignore
    const task: Task = ws.data.task;

    const str = [...message].map(x => typeof x === 'number' ? String.fromCharCode(x) : x).join('');
    task.writeStdin(str);
  },
  close(ws: ServerWebSocket) {
    //@ts-ignore
    const task: Task = ws.data.task;
    task.kill();
  },
  upgrade: (ctx: Context) => {
    const hash = ctx.url.searchParams.get('hash');
    if (!hash) {
      ctx.sendResponse(new Response('hash is not specified', { status: 400 }));
      return;
    }

    const problem = problems.getProblemWithHash(hash);
    if (!problem) {
      ctx.sendResponse(new Response('problem not found', { status: 404 }));
      return;
    }

    const task = problem.runtime();

    //@ts-ignore
    ctx.acceptWebsocketUpgrade({
      data: {
        task
      }
    });
  }
}