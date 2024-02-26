import { UserRole } from "./entity/roles"
import { User } from "./entity/User"
import { Project } from "./entity/project"
import { Release } from "./entity/release"
import { Sprint } from "./entity/sprint"
import "reflect-metadata"
import { DataSource, EntityTarget, FindManyOptions, FindOptionsWhere, ObjectLiteral, QueryFailedError } from "typeorm"
import { Bug, Epic, Infrastructure, Spike, Story, Task, TodoItem } from "./entity/todo"
import { authentication, random } from "./helpers"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "test",
    password: "test",
    database: "test",
    synchronize: true,
    logging: true,
    entities: [User, Project, Release, UserRole, Sprint, TodoItem, Epic, Story, Task, Spike, Infrastructure, Bug],
    subscribers: [],
    migrations: [],
})

export class Database {

	///// Initialization /////

	private static instance: Database;
	private dataSource: DataSource | null = null

	private constructor(dataSource: DataSource) {
		this.initialize(dataSource);
	}

	public static getInstance(): Database {
		if (!Database.instance) {
			throw new Error("Database is not initialized! Use setAndGetInstance first.")
		}
		return Database.instance;
	}

	public static async setAndGetInstance(dataSource: DataSource): Promise<Database> {
		if (!Database.instance) {
			if (!dataSource.isInitialized)
				throw new Error("Database's DataSource is not initialized! Use setAndGetInstance first.")
			Database.instance = new Database(dataSource);
		}
		return Database.instance;
	}

	private initialize(dataSource: DataSource): void {
		try {
			this.dataSource = dataSource;
			console.log('Connected to database');
		} catch (error) {
			console.error('Error connecting to database:', error);
			throw error; // Rethrow the error to notify the caller of the failure
		}
	}

	public get databaseIsInitialized(): boolean {
		return Database.instance != null;
	}

	public get dataSourceIsInitialized(): boolean {
		return this.dataSource != null && this.dataSource.isInitialized;
	}

	///// User Methods /////

	public async createNewUser(username: string, email: string, password: string, salt?: string, sessionToken?: string): Promise<User> {
		const newUser = new User()
		newUser.username = username
		newUser.email = email
		newUser.salt = salt ?? random();
		newUser.password = authentication(newUser.salt, password);
		
		try {
			await this.dataSource.manager.save(newUser)
		} catch {
			throw new Error("Likely found a duplicate username or email")
		}
		delete newUser.password;

		return newUser
	}

	public async updateUser(id: number, username: string, email: string, password: string, salt?: string, sessionToken?: string): Promise<User> {
		const user = await this.lookupUserById(id)
		if (!user) {
			throw new Error("user not found")
		}
		user.username = username ?? user.username
		user.email = email ?? user.email
		user.password = password ?? user.password
		user.salt = salt ?? user.salt
		user.sessionToken = sessionToken ?? user.sessionToken

		this.dataSource.manager.save(user)
		return user
	}

	public async lookupUserById(id: number): Promise<User | void> {
		return await this.dataSource.manager.findOneBy(User, {id: id});
	}

	/// returns a tuple of (owned projects, joined projects)
	public async fetchUserWithProjects(id: number): Promise<User> {
		return await this.dataSource.manager.findOneBy(User, {id: id, ownedProjects: true, joinedProjects: true})
	}

	///// General Methods - Only use if there is not a method above to use /////

	public async save(item: any) {
		return await this.dataSource.manager.save(item);
	}

	public async find(entity: EntityTarget<ObjectLiteral>, findOptions: FindManyOptions<ObjectLiteral>) {
		return await this.dataSource.manager.find(entity, findOptions)
	}

	public async findBy(entity: EntityTarget<ObjectLiteral>, findWhereOptions: FindOptionsWhere<ObjectLiteral> | FindOptionsWhere<ObjectLiteral>[]) {
		return await this.dataSource.manager.findBy(entity, findWhereOptions)
	}

	public async deleteAll(): Promise<void> {
		await this.dataSource.getRepository(UserRole).delete({})
		await this.dataSource.getRepository(TodoItem).delete({})
		await this.dataSource.getRepository(Sprint).delete({})
		await this.dataSource.getRepository(Release).delete({})
		await this.dataSource.getRepository(Project).delete({})
		await this.dataSource.getRepository(User).delete({})
	}

}
