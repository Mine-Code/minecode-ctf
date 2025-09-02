export class ProblemManager {
    provider;
    problems = {};
    constructor(provider) {
        this.provider = provider;
    }
    async init() {
        const problems = await this.provider();
        this.problems = problems.reduce((acc, problem) => {
            acc[problem.getHash()] = problem;
            return acc;
        }, {});
        globalThis.process.on("SIGINT", async () => {
            console.log("Doing cleanup...");
            await this.cleanup();
            globalThis.process.exit(0);
        });
        globalThis.process.on("SIGTERM", async () => {
            console.log("Doing cleanup...");
            await this.cleanup();
            globalThis.process.exit(0);
        });
    }
    getProblems() {
        return this.problems;
    }
    getProblemByHash(hash) {
        return this.problems[hash] || null;
    }
    async cleanup() {
        for (const problem of Object.values(this.problems)) {
            await problem.getWorker().cleanup();
        }
    }
}
