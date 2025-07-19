import { Hono } from "hono";
import { problemsRoute } from "./problems";
import { testRoute } from "./test";

const app = new Hono();

const route = app.route("/problems", problemsRoute).route("/test", testRoute);

export { route as apiRoute };
