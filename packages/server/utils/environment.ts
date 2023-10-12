import dotenv from "dotenv";

export const setEnvironmentVariables = () => {
    switch(process.env.VAR_NODE_ENV) {
        case 'production':
            dotenv.config({ path: '.env.production' });
            break;
        default:
            dotenv.config({ path: '.env.development' });
            break;
    }
}
