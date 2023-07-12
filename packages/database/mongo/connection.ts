import { DataSource } from "typeorm";
import { ConfigEntity } from "./entity/ConfigEntity";

export const mongoConnection = new DataSource({
    type: "mongodb",
    host: process.env.VAR_HOST_GRAPHQL,
    port: process.env.VAR_PORT_GRAPHQL ? parseInt(process.env.VAR_PORT_GRAPHQL) : 27017,
    database: process.env.VAR_DATABASE_GRAPHQL,
    useUnifiedTopology: true,
    cache: false,
    entities: [
        ConfigEntity
    ]
})
