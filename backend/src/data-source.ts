import { UserRole } from "./entity/roles"
import { User } from "./entity/User"
import { Project } from "./entity/project"
import { Release } from "./entity/release"
import { Sprint } from "./entity/sprint"
import "reflect-metadata"
import { DataSource } from "typeorm"
import { Bug, Epic, Infrastructure, Spike, Story, Task, TodoItem } from "./entity/todo"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "arthur",
    database: "test",
    synchronize: true,
    logging: true,
    entities: [User, Project, Release, UserRole, Sprint, TodoItem, Epic, Story, Task, Spike, Infrastructure, Bug],
    subscribers: [],
    migrations: [],
})