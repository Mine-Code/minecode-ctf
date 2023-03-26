import express from "express";
import { Server as WSServer } from "ws";
import problems from "./datas/problem_manager.js"

Bun.serve({
  port: (process.env.PORT ? parseInt(process.env.PORT) : null) || 3000,

  fetch(req, server) {
    if (req.url.match(/\/interactive\/(.*)$/) && server.upgrade(req)) return;


    return app(req, server);
  },
  websocket: {
    open(ws) {

    }, // a socket is opened
    message(ws, message) { }, // a message is received
    close(ws, code, message) { }, // a socket is closed
    drain(ws) { }, // the socket is ready to receive more data
  },
});

/**
 * @argument {Promise<T>} p
 * @returns {Promise<T>}
 */
function withTimeOut(p, timeout, as_error = true) {
  return new Promise((resolve, reject) => {
    let timer = setTimeout(() => {
      if (as_error) reject(new Error("Timeout"));
      else resolve(null);
    }, timeout);

    p.then((x) => {
      clearTimeout(timer);
      resolve(x);
    }).catch((e) => {
      clearTimeout(timer);
      if (as_error) reject(e);
      else resolve(null);
    });
  });
}

app.get('/test/:hash/:json', async function (req, res) {
  const problem = problems.getProblemWithHash(req.params.hash);
  if (!problem) {
    res.send("Unknown App has selected.");
    return;
  }

  const input = JSON.parse(`"${req.params.json}"`);
  const escaped = input.
    split(/(.)/).
    filter(Boolean).
    map(x => `\\x${x.
      charCodeAt(0).
      toString(16).
      padStart(2, "0")}`
    ).join("");

  let task = problem.runtime();

  task.writeStdin(escaped);

  /** @type {string} */
  let output = await withTimeOut(task, 2, false);

  let r = JSON.stringify({ buffer: output });
  res.send(r);
});

const wsServer = new WSServer({ noServer: true });

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
  console.log('[Server] CTF Server started');
});

server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, socket => {
    wsServer.emit('connection', socket, request);
  });
});