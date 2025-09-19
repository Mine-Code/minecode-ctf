import { existsSync, readFileSync, writeFileSync } from "fs";

const PORT_ASSIGNMENT_FILE =
  process.env.PORT_ASSIGNMENT_FILE || "./port_assignment.json";
const PORT_ASSIGN_START = process.env.PORT_ASSIGN_START
  ? parseInt(process.env.PORT_ASSIGN_START)
  : 9500;

class PortAssignment {
  private assignments: Record<string, number> = {};
  private assignedPorts: Set<number> = new Set();

  saveFile(path: string) {
    try {
      const content = JSON.stringify(this.assignments, null, 2);
      writeFileSync(path, content, "utf-8");
    } catch (error) {
      console.error("Error writing port assignment file:", error);
    }
  }

  static loadFile(path: string): PortAssignment {
    const instance = new PortAssignment();

    if (!existsSync(path)) {
      return instance;
    }

    try {
      const content = readFileSync(path, "utf-8");
      instance.assignments = JSON.parse(content);
      instance.assignedPorts = new Set(Object.values(instance.assignments));
    } catch (error) {
      console.error("Error reading port assignment file:", error);
    }

    return instance;
  }

  portUsed(port: number): boolean {
    return this.assignedPorts.has(port);
  }

  portAssigned(problemId: string): number | undefined {
    return this.assignments[problemId];
  }

  assignPort(problemId: string, port: number) {
    this.assignments[problemId] = port;
    this.assignedPorts.add(port);
  }

  getPortAssignments(): Record<string, number> {
    return this.assignments;
  }
}

export class PortManager {
  private portAssignment: PortAssignment;

  constructor() {
    this.portAssignment = PortAssignment.loadFile(PORT_ASSIGNMENT_FILE);
  }

  private allocateNewPort(): number {
    let port = PORT_ASSIGN_START;

    while (this.portAssignment.portUsed(port)) {
      port++;
    }

    return port;
  }

  getPortForProblem(problemId: string): number {
    const assigned_port = this.portAssignment.portAssigned(problemId);
    if (assigned_port !== undefined) {
      return assigned_port;
    }

    const new_port = this.allocateNewPort();
    this.portAssignment.assignPort(problemId, new_port);

    this.portAssignment.saveFile(PORT_ASSIGNMENT_FILE);
    return new_port;
  }

  getPortAssignments(): Record<string, number> {
    return this.portAssignment.getPortAssignments();
  }
}
