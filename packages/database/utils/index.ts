import { DataSource } from "typeorm";

export const initializeDataBase = async (conn: DataSource) => {
    try {
        await conn.initialize();
        console.log("Data Source has been initialized");
    } catch (error) {
        console.error("Error during Data Source initialization", error);
        setTimeout(() => {
            initializeDataBase(conn);
        }, 2000);
    }
}
