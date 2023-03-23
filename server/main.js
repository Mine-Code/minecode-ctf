const express = require('express');
const ws = require('ws');
const problems = require('./datas/_index');

const app = express();

/** @argument {Promise} p */
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

class DockerWrapper {
  /** @argument {String} problem_path */
  constructor(problem_path) {
    this.problem_path = problem_path;
    this.process = null;
    this.onMessage = (data) => { };
    this.onDisconnect = (code) => { };
    this.onConnect = () => { };
  }
}


app.get('/test/:app/:json', async function (req, res) {
  const problem = problems.resolveProblem(req.params.app);
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

  let buffer = "";
  let c = 0;
  const sess = problem.start();
  sess.onMessage((data) => {
    buffer += data;
  });
  sess.passMessage(escaped);
  sess.onDisconnect((code) => {
    c = code;
  });
  await withTimeOut(sess.waitExit(), 2, false);

  let r = JSON.stringify({ buffer: buffer, c: c });
  res.send(r);
});


const wsServer = new ws.Server({ noServer: true });

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