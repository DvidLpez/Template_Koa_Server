import { DataSource } from "typeorm";

export const mysqlConnection = new DataSource({
    type: "mysql",
    host: process.env.VAR_HOST_MYSQL,
    port: process.env.VAR_PORT_MYSQL ? parseInt(process.env.VAR_PORT_MYSQL) : 4000,
    database: process.env.VAR_DATABASE_MYSQL,
    cache: true,
    entities: [
        // Eg. ConfigEntity
    ],
})
