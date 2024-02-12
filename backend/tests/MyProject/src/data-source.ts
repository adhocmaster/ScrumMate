import "reflect-metadata"
import { DataSource } from "typeorm"
import { Project } from "./entity/project"
import { User } from "./entity/user"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "test",
    password: "test",
    database: "test",
    synchronize: true,
    logging: false,
    entities: [User, Project],
    migrations: [],
    subscribers: [],
})
