import dotenv from "dotenv";

export const setEnvironmentVariables = () => {
    let environment = null;

    switch(process.env.VAR_NODE_ENV) {
        case 'production':
            environment = dotenv.config({ path: '.env.production' });
            break;
        default:
            environment = dotenv.config({ path: '.env.development' });
            break;
    }

    return environment;
}
