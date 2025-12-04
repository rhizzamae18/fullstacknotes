import { remultExpress } from "remult/remult-express";
import { Task } from "../shared/task.js";
import { TasksController } from "../shared/TasksController.js";
import { createPostgresConnection } from "remult/postgres";
const connectionString = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5433/postgres";
export const api = remultExpress({
    entities: [Task],
    controllers: [TasksController],
    getUser: (req) => req.session?.["user"],
    dataProvider: async () => {
        if (process.env.DATABASE_URL) {
            return createPostgresConnection({ connectionString });
        }
        return undefined;
    },
});
