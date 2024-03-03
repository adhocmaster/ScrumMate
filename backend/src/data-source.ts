import { User } from "./entity/User"
import { Project } from "./entity/project"
import { Release } from "./entity/release"
import { UserRole } from "./entity/roles"
import { Sprint } from "./entity/sprint"
import { DataSource, EntityTarget, FindManyOptions, FindOptionsWhere, ObjectLiteral, QueryFailedError } from "typeorm"
import { Bug, Epic, Infrastructure, Spike, Story, Task, BacklogItem, Priority } from "./entity/backlogItem"
import { authentication, random } from "./helpers"
import "reflect-metadata"
import { ExistingUserError, NotFoundError, NotSavedError } from "./helpers/errors"
import { reverse } from "lodash"

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
