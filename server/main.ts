import { Router } from "@kapsonfire/bun-bakery"

const router = new Router({
  assetsPath: `${import.meta.dir}/backend/assets/`,
  routesPath: `${import.meta.dir}/backend/routes/`,
  port: process.env.PORT ? parseInt(process.env.PORT) : undefined || 3000
});

router.listen()

await router.awaitListen();
console.log('[Server] CTF Server started');