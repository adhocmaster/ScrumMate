import { User } from "./entity/User"
import { Project } from "./entity/project"
import { Release } from "./entity/release"
import { Revision } from "./entity/revision"
import { Sprint } from "./entity/sprint"
import { Story } from "./entity/story"
import { Task } from "./entity/task"
import "reflect-metadata"
import { DataSource } from "typeorm"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "test",
    password: "test",
    database: "test",
    synchronize: true,
    logging: true,
    entities: [User, Project, Release, Revision, Sprint, Story, Task],
    subscribers: [],
    migrations: [],
})