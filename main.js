const express = require('express');
const ws = require('ws');
const child_process = require("child_process");
const WsStream = require('wsstream');
const net = require('net');
const problems = require('datas/problem.json');

const app = express();

app.get('/test/:app/:json', function(req, res) {
  const app_path = executable_table[req.params.app];
  if (!app_path) {
    res.send("Error: Invalid App path.");
  }
  
  const input = JSON.parse(`"${req.params.json}"`);
  const escaped = input.
    split(/(.)/).
    filter(Boolean).
    map(x => "\\x"+x.
      charCodeAt(0).
      toString(16).
      padStart(2, "0")
    ).join("");
  
  const cmd = `stdbuf -i0 -o0 sh -c 'printf "${escaped}" | ${app_path}'`;
  
  const cp = child_process.exec(cmd);

  let stdout = "";
  cp.stdout.on('data', (data) => {
    stdout += data;
  });
  
  let stderr = "";
  cp.stderr.on('data', (data) => {
    stderr += data;
  });
    
  setTimeout(function(){
    cp.kill();
    let r = JSON.stringify({
      stdout: stdout,
      stderr: stderr
    });
    res.send(r)
  }, 2000);
});


const wsServer = new ws.Server({ noServer: true });

function socket_wrapper(sock) {
  const client = net.createConnection('sockets/2022_2nd_3', () => {
      socket.send('[Socket Wrapper] Connected to "Canary" Server\n');
    });

    client.on('data', data => {
      socket.send(data);
    });
    client.on('error', (e) => {
      socket.send(`[Socket Wrapper] Failed to connect Server: ${e}\n`);
    })

    socket.on('message', (data) => {
      client.write(data);
    });

    client.on('close', () => {
      socket.send('[Socket Wrapper] Closed connection by remote\n');
    });
}

wsServer.on('connection', (socket, req) => {
  let match = req.url.match(/\/interactive\/(.*)$/);
  if (!match) {
    socket.send(`[Websocket Handler] Error: Invalid Ws Path format\n`);
    socket.send(`[Websocket Handler]   Correct Format: /interactive/{AppName}\n`)
    socket.send(`[Websocket Handler]          Example: /interactive/2022_2nd_0\n`);
    socket.send(`[Websocket Handler] Secret Flag: mineCTF{F1nD1nG_B4cK3nD_4p1_WbS0cK}\n`);
    socket.send("[Websocket Handler] You can input this key in the hamburger menu\n");
    socket.close();
    return;
  }
  let executable = executable_table[match[1]];
  if (!executable) {
    socket.send(`[Websocket Handler] Error: Unknown App has selected.\n`);
    socket.send(`[Websocket Handler]   Available App: ${JSON.stringify()}\n`);
    socket.send(`[Websocket Handler] Secret Flag: mineCTF{1Nv4L1d_B4cK3nD_4p1_1NpU7}\n`);
    socket.send("[Websocket Handler] You can input this key in the hamburger menu\n");
    socket.close();
    return;
  }

  if (executable == 'CTF/2022/2nd/3.c.elf') {
    
    return;
  } else {
    const app = child_process.spawn(`sh`, ["-c", `stdbuf -i0 -o0 ${executable}`])
  
    app.stdout.on('data', (data) => {
      socket.send(data);
    });
  
    app.stderr.on('data', (data) => {
      socket.send(data);
    });
  
    socket.on('message', (data) => {
      app.stdin.write(data);
    });
    app.on('close', (code) => {
      socket.send(`[App Wrapper] The app has exited with code ${code}\n`)
      socket.close();
    }); 
  }
});

const server = app.listen(3000, () => {
  console.log('[Server] CTF Server started');
});

server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, socket => {
    wsServer.emit('connection', socket, request);
  });
});