import { DataSource } from "typeorm";
import token from "jsonwebtoken";

export const initializeDataBase = async (conn: DataSource) => {
    try {
        await conn.initialize();
        console.log("Data Source has been initialized");
    } catch (error) {
        console.error("Error during Data Source initialization", error);
        initializeDataBase(conn);
    }
}

export const initializeJWT = (clientIds:Array<string>) => {
    const secret = process.env.SEC_REST_SECRET ?? "";
    clientIds.forEach(clientId => {
        console.log(JSON.stringify({ clientId: clientId, token: token.sign({ clientId: clientId }, secret )}));
    });
}
