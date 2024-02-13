import "reflect-metadata"
import { DataSource } from "typeorm"
import { Project } from "../../../src/entity/project"
import { User } from "../../../src/entity/User"
import { Release } from "../../../src/entity/release"
import { Revision } from "../../../src/entity/revision"
import { Sprint } from "../../../src/entity/sprint"
import { Story } from "../../../src/entity/story"
import { Task } from "../../../src/entity/task"

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
