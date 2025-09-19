import { Hono } from "hono";
import { route as problemsRoute } from "./problems";
import { route as testRoute } from "./test";

const app = new Hono();

const route = app.route("/problems", problemsRoute).route("/test", testRoute);

export { route as apiRoute };
