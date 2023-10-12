import { DataSource } from "typeorm";

export const initializeDataBase = async (conn: DataSource) => {
    try {
        await conn.initialize();
        console.log("[server]: Connection to mongo has been initialized");
    } catch (error) {
        console.error("[server]: Error initializing DataSource", error);
        setTimeout(() => {
            initializeDataBase(conn);
        }, 2000);
    }
} 
