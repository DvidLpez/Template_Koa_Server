import { DataSource } from "typeorm";

export const mysqlConnection = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 4000,
    database: "development",
    cache: true,
    entities: [
        // Eg. ConfigEntity
    ],
})
