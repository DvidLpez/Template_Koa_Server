import KoaRouter from "koa-router";
import bodyParser from "koa-bodyparser";
import jwt from "koa-jwt";
import { handling401 } from "../middlewares/middlewares";
import { getKey, getKeys, setNewOrUpdateKeyValue } from "../controllers/configController";

export const configRoutes = () => {
    const configRouter: KoaRouter = new KoaRouter();
    configRouter.use(handling401);
    configRouter.use(jwt({ secret: process.env.VAR_USER_ACCESS_TOKEN!}));
    configRouter.use(bodyParser())
    configRouter.post("/key", setNewOrUpdateKeyValue);
    configRouter.get("/keys", getKeys);
    configRouter.get("/key", getKey);
    return configRouter;
}
