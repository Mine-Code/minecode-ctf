import { Hono } from "hono";
import { problemsRoute } from "./problems.js";
import { testRoute } from "./test.js";
const app = new Hono();
const route = app.route("/problems", problemsRoute).route("/test", testRoute);
export { route as apiRoute };
