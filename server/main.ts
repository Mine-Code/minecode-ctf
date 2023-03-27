import { Router } from "@kapsonfire/bun-bakery"

const router = new Router({
  assetsPath: `${import.meta.dir}/backend/assets/`,
  routesPath: `${import.meta.dir}/backend/routes/`,
  port: process.env.PORT ? parseInt(process.env.PORT) : undefined || 3000
});

router.listen()

await router.awaitListen();
console.log('[Server] CTF Server started');

/*
import { Server as WSServer } from "ws";
import problems from "./datas/problem_manager.js"


wsServer.on('connection', (socket, req) => {
  let match = req.url.match(/\/interactive\/(.*)$/);
  if (!match) {
    socket.send("[Websocket Handler] Error: Invalid Ws Path format\n");
    socket.send("[Websocket Handler]   Correct Format: /interactive/{AppName}\"");
    socket.send("[Websocket Handler]          Example: /interactive/2022_2nd_0\n");
    socket.send("[Websocket Handler] Secret Flag: sf0\n");
    socket.send("[Websocket Handler] You can input this key in the hamburger menu\n");
    socket.close();
    return;
  }

  let problem = problems.resolveProblem(match[1]);
  if (!problem) {
    socket.send("[Websocket Handler] Error: Unknown App has selected.\n");
    socket.send(`[Websocket Handler]   Available App: ${JSON.stringify()}\n`);
    socket.send("[Websocket Handler] Secret Flag: sf1\n");
    socket.send("[Websocket Handler] You can input this key in the hamburger menu\n");
    socket.close();
    return;
  }

  const sess = problem.start();
  sess.onMessage((data) => {
    socket.send(data);
  });

  sess.onDisconnect((code) => {
    socket.send(`[Wrapper] The app has exited with code ${code}\n`);

    socket.close();
  });

  sess.onConnect(() => {
    socket.send("[Wrapper] The app has started\n");
  });

  socket.on("message", (data) => {
    sess.passMessage(data);
  });
});

const server = app.listen(process.env.PORT || 3000, () => {

});
*/