const child_process = require("child_process");
const net = require('net');

class WorkerSessionBase {
  /** @typedef {(string) => void} MessageHandler */
  /** @typedef {(number) => void} NumberHandler */
  /** @typedef {() => void} EventHandler */

  /** @argument {MessageHandler} handler */
  onMessage(handler) {
    throw new Error("Not implemented");
  }

  /** @argument {NumberHandler} handler */
  onDisconnect(handler) {
    throw new Error("Not implemented");
  }

  /** @argument {EventHandler} handler */
  onConnect(handler) {
    throw new Error("Not implemented");
  }

  /** @argument {String} data */
  passMessage(data) {
    throw new Error("Not implemented");
  }

  requestExit() {
    throw new Error("Not implemented");
  }

  waitExit() {
    return new Promise((resolve) => {
      this.onDisconnect(resolve);
    });
  }

}

class ProcessWorkerSession extends WorkerSessionBase {
  constructor(worker) {
    super();

    /** @type {ProcessWorker} */
    this.worker = worker;

    /** @type {child_process.ChildProcess} */
    this.process = child_process.spawn('sh', [
      '-c',
      `stdbuf -i0 -o0 ${this.worker.process}`
    ]);
  }

  /** @argument {MessageHandler} handler */
  onMessage(handler) {
    this.process.stdout.on('data', (data) => {
      handler(data);
    });
  }

  /** @argument {NumberHandler} handler */
  onDisconnect(handler) {
    this.process.on('close', (code, sig) => {
      const integrated_code = sig ? sig.toString() : code;
      handler(integrated_code);
    });
  }

  /** @argument {EventHandler} handler */
  onConnect(handler) {
    this.process.on('spawn', () => {
      handler();
    });
  }

  /** @argument {string} data */
  passMessage(data) {
    this.process.stdin.write(data);
  }

  requestExit() {
    this.process.kill();
  }
}

class SocketWorkerSession extends WorkerSessionBase {
  constructor(worker) {
    super();

    /** @type {SocketWorker} */
    this.worker = worker;

    /** @type {net.Socket} */
    this.socket = net.createConnection(this.worker.path, () => {
      this.is_connected = true;
      this.connection_handlers.forEach((handler) => {
        handler();
      });
    });

    this.is_connected = false;
    this.connection_handlers = [];
  }

  /** @argument {MessageHandler} handler */
  onMessage(handler) {
    this.socket.on('data', (data) => {
      handler(data);
    });
  }

  /** @argument {NumberHandler} handler */
  onDisconnect(handler) {
    this.socket.on('close', (f) => {
      handler(1 - f);
    });
  }

  /** @argument {EventHandler} handler */
  onConnect(handler) {
    if (this.is_connected) {
      handler();
      return;
    }

    this.socket.on('connect', () => {
      handler();
    });
  }

  /** @argument {string} data */
  passMessage(data) {
    this.socket.write(data);
  }

  requestExit() {
    this.socket.close();
  }
}

class WorkerBase {
  constructor(obj) {
    /** @type {object} */
    this.obj = obj;

    /** @type {string} */
    this.type = obj.type;
  }

  /** @returns {WorkerSessionBase} */
  start() {
    throw new Error("Not implemented");
  }
}

class ProcessWorker extends WorkerBase {
  constructor(obj) {
    super(obj);

    /** @type {string} */
    this.process = this.obj.path;
  }

  /** @returns {ProcessWorkerSession} */
  start() {
    return new ProcessWorkerSession(this);
  }
}

class SocketWorker extends WorkerBase {
  constructor(obj) {
    super(obj);

    /** @type {string} */
    this.path = this.obj.path;
  }

  /** @returns {SocketWorkerSession} */
  start() {
    return new SocketWorkerSession(this);
  }
}

/** @returns {WorkerBase} */
function Worker(obj) {
  if (obj.type === 'exec') {
    return new ProcessWorker(obj);
  } else if (obj.type === 'socket') {
    return new SocketWorker(obj);
  } else {
    throw new Error(`Unknown worker type: ${obj.type}`);
  }
}

class Problem {
  constructor(obj) {
    /** @type {string} */
    this.name = obj.name;

    /** @type {string} */
    this.id = obj.id;

    /** @type {string} */
    this.author = obj.author;

    /** @type {string[]} */
    this.hints = obj.hints;

    /** @type {{[key: string]: string}} */
    this.files = obj.files;

    this.worker = Worker(obj.worker);
  }

  /** @returns {WorkerSessionBase} */
  start() {
    return this.worker.start();
  }
}

class Event {
  constructor(obj) {
    this.started = new Date(obj.date);

    /** @type {Problem[]} */
    this.problems = obj.problems.map((problem) => new Problem(problem));
  }

  /** @argument {string} id */
  resolveProblem(id) {
    return this.problems.find((problem) => problem.id === id);
  }
}

class ProblemsDefinetion {
  constructor(obj) {
    /** @type {string} */
    this.current = obj.current;

    /** @type {{[key: string]: Event}} */
    this.events = {};
    for (const [key, value] of Object.entries(obj.events)) {
      this.events[key] = new Event(value);
    }
  }
}

const datas = new ProblemsDefinetion(require("./problem.json"));

module.exports = datas.events[datas.current];