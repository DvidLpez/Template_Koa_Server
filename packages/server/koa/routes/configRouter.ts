import KoaRouter from "koa-router";
import { Context, Next, ParameterizedContext } from 'koa';
import bodyParser from "koa-bodyparser";
import jwt from "koa-jwt";
import ConfigRepository from "../../../database/mongo/repository/ConfigRepository";
import { IConfigKey } from "../../../core/interfaces";

const getKey = async(ctx: Context, next: () => Promise<any>) => {
    try {
        let params = getRequestParams(ctx.request.body);
        let result = await new ConfigRepository().findOne(params.key);
        {
            ctx.status = 200;
            ctx.body = JSON.stringify( {key: result.key, value: result.value} );
        }  
    }
    catch (error: any) {
        ctx.status = 500;
        ctx.body = JSON.stringify({ error: error.message });
    }
}

const getKeys = async(ctx: Context, next: () => Promise<any>) => {
    try {
        let result = await new ConfigRepository().all();
        {
            ctx.status = 200;
            ctx.body = JSON.stringify( { amount: result.amount, elements: result.elements} );
        }
    }
    catch (error: any) {
        ctx.status = 500;
        ctx.body = JSON.stringify({ error: error.message });
    }
}

const setNewOrUpdateKeyValue = async (ctx: Context, next: () => Promise<any>) => {
    try {
        let params: IConfigKey = getRequestParams(ctx.request.body);
        const { key, value } = params;
        let result = await new ConfigRepository().update(key, value);
        {
            ctx.status = 201;
            ctx.body = JSON.stringify( {result} );
        }   
    }
    catch (error) {
        ctx.status = 500;
        ctx.body = JSON.stringify({ error: error });
    }
}

const getRequestParams = (body: any) => {
    return {
        key: body.key ?? null,
        value: body.value ?? null,
    }
}

const handling401 = async (ctx: ParameterizedContext<any, KoaRouter.IRouterParamContext<any, {}>, any>, next: Next) => {
    return next().catch((err) => {
        if (err.status === 401) {
            ctx.status = 401;
            let errMessage = err.originalError ?
            err.originalError.message :
            err.message
            ctx.body = {
            error: errMessage
            };
            ctx.set("X-Status-Reason", errMessage)
        } else {
            throw err;
        }
        });
}

export const configRoutes = () => {
    const configRouter: KoaRouter = new KoaRouter();
    configRouter.use(handling401);
    configRouter.use(jwt({ secret: process.env.SEC_REST_SECRET || "" }));
    configRouter.use(bodyParser())
    configRouter.post("/key", setNewOrUpdateKeyValue);
    configRouter.get("/keys", getKeys);
    configRouter.get("/key", getKey);
    return configRouter;
}
