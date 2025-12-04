import { remultExpress } from "remult/remult-express";

import { Task } from "../shared/task.js";
import { TasksController } from "../shared/TasksController.js";
import { createPostgresConnection } from "remult/postgres";


const connectionString = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5433/postgres";

export const api = remultExpress({
    entities: [Task],
    controllers: [TasksController],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getUser: (req: any) => req.session?.["user"],
    dataProvider: async () => {
        try {
            const provider = await createPostgresConnection({ connectionString });
            console.log("Connected to PostgreSQL");
            return provider;
        } catch (error) {
            console.error("Failed to connect to PostgreSQL:", error);
            throw error;
        }
    },
});