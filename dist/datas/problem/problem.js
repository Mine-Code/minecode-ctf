import { readFileSync } from "fs";
import path from "path";
import Metadata from "./metadata/metadata.js";
export default class Problem {
    problem_path;
    metadata;
    constructor(problem_path) {
        this.problem_path = problem_path;
        const metadata_string = readFileSync(path.join(problem_path, "metadata.json")).toString();
        const metadata_object = JSON.parse(metadata_string);
        this.metadata = new Metadata(problem_path, metadata_object);
    }
    init() {
        return this.metadata.tasks.init.execute();
    }
    runtime() {
        return this.metadata.tasks.runtime.execute();
    }
    daemon() {
        return this.metadata.tasks.daemon.execute();
    }
}
