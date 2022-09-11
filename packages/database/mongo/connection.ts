import { DataSource } from "typeorm";
import { ConfigEntity } from "./entity/ConfigEntity";

export const mongoConnection = new DataSource({
    type: "mongodb",
    host: "localhost",
    port: 27017,
    database: "development_dlb",
    useUnifiedTopology: true,
    cache: false,
    entities: [
        ConfigEntity
    ]
})
