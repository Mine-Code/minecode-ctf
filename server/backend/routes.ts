import { Router } from "@kapsonfire/bun-bakery"

export default new Router({
    assetsPath: `${import.meta.dir}/assets/`,
    routesPath: `${import.meta.dir}/routes/`
})