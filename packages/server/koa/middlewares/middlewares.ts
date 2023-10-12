import { Next, ParameterizedContext } from 'koa';
import KoaRouter from "koa-router";

// Custom 401 handling if you don't want to expose koa-jwt errors to users
export const handling401 = async (ctx: ParameterizedContext<any, KoaRouter.IRouterParamContext<any, {}>, any>, next: Next) => {
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

