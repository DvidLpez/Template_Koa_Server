import { setEnvironmentVariables } from "../../server/utils";
import { DataSource } from "typeorm";

setEnvironmentVariables()

export const mysqlConnection = new DataSource({
    type: "mysql",
    host: process.env.VAR_HOST_MYSQL,
    port: process.env.VAR_PORT_MYSQL ? parseInt(process.env.VAR_PORT_MYSQL) : 3306,
    database: process.env.VAR_DATABASE_MYSQL,
    username: process.env.VAR_USER_MYSQL,
    password: process.env.VAR_PASS_MYSQL,
    cache: false,
    entities: ["packages/database/mysql/entities/*.ts"]
})
