import "reflect-metadata"
import { DataSource } from "typeorm"
import { Project } from "./entity/project"
import { User } from "./entity/user"
import { Release } from "./entity/release"
import { Revision } from "./entity/revision"
import { Sprint } from "./entity/sprint"
import { Story } from "./entity/story"
import { Task } from "./entity/task"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "test",
    password: "test",
    database: "test",
    synchronize: true,
    logging: false,
    entities: [User, Project, Release, Revision, Sprint, Story, Task],
    migrations: [],
    subscribers: [],
})
