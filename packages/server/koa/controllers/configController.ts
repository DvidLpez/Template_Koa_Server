import { Context } from 'koa';
import { ConfigRepository } from "../../../database/mongo/repository";
import { IConfigKey } from "../../../core/interfaces";


export const getKey = async(ctx: Context, next: () => Promise<any>) => {
    try {
        let params = getRequestQueryParams(ctx.request.query);

        let result = await new ConfigRepository().findOne(params.name);
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

export const getKeys = async(ctx: Context, next: () => Promise<any>) => {
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

export const setNewOrUpdateKeyValue = async (ctx: Context, next: () => Promise<any>) => {
    try {
        let params: IConfigKey = getRequestBodyParams(ctx.request.body);
        let result = await new ConfigRepository().update(params);
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

const getRequestBodyParams = (bodyParams: any) => {
    return {
        name: bodyParams.name ?? null,
        value: bodyParams.value ?? null,
    }
}

const getRequestQueryParams = (queryParams: any) => {
    return {
        name: queryParams.name ?? null
    }
}
