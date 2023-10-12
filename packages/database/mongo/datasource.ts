import { DataSource } from "typeorm";
import { ConfigEntity, UserEntity } from "./entities";
import { setEnvironmentVariables } from "../../../packages/server/utils";

setEnvironmentVariables();

export const mongoConnection =  new DataSource({
    type: "mongodb",
    authSource: process.env.VAR_SOURCE_MONGO,
    host: process.env.VAR_HOST_MONGO,
    port: process.env.VAR_PORT_MONGO ? parseInt(process.env.VAR_PORT_MONGO) : 27017,
    database: process.env.VAR_DATABASE_MONGO,
    username: process.env.VAR_USER_MONGO,
    password: process.env.VAR_PASS_MONGO,
    useUnifiedTopology: true,
    cache: false,
    entities: ["packages/database/mongo/entities/index.ts"]
})
