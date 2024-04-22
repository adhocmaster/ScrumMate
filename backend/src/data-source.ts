import { User } from "./entity/User"
import { Project } from "./entity/project"
import { Release } from "./entity/release"
import { UserRole } from "./entity/roles"
import { Sprint } from "./entity/sprint"
import { DataSource } from "typeorm"
import { Bug, Epic, Infrastructure, Spike, Story, Task, BacklogItem } from "./entity/backlogItem"
import "reflect-metadata"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "test",
    password: "test",
    database: "test",
    synchronize: true,
    logging: false,
    entities: [User, Project, Release, UserRole, Sprint, BacklogItem, Epic, Story, Task, Spike, Infrastructure, Bug],
    subscribers: [],
    migrations: [],
})
