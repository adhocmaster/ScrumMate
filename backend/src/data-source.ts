import { User } from "./entity/User"
import { Project } from "./entity/project"
import { Release } from "./entity/release"
import { UserRole } from "./entity/roles"
import { Sprint } from "./entity/sprint"
import { DataSource, EntityTarget, FindManyOptions, FindOptionsWhere, ObjectLiteral, QueryFailedError } from "typeorm"
import { Bug, Epic, Infrastructure, Spike, Story, Task, TodoItem } from "./entity/todo"
import { authentication, random } from "./helpers"
import "reflect-metadata"

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
			await this.save(newUser)
		} catch {
			throw new Error("Likely found a duplicate username or email")
		}
		delete newUser.password;

		return newUser
	}

	public async updateUser(id: number, username?: string, email?: string, password?: string, salt?: string, sessionToken?: string): Promise<User> {
		const user = await this.lookupUserById(id)
		user.username = username ?? user.username
		user.email = email ?? user.email
		user.password = password ?? user.password
		user.salt = salt ?? user.salt
		user.sessionToken = sessionToken ?? user.sessionToken

		this.save(user)
		return user
	}

	// Errors if not found.
	public async lookupUserById(id: number): Promise<User> {
		const maybeUser = await this.dataSource.manager.findOneBy(User, {id: id});
		if (!maybeUser) {
			throw new Error(`User with id ${id} not found`)
		}
		return maybeUser
	}

	// Errors if not found.
	public async lookupUserByEmail(email: string): Promise<User> {
		const maybeUser = await this.dataSource.manager.findOneBy(User, {email: email});
		if (!maybeUser) {
			throw new Error(`User with email ${email} not found`)
		}
		return maybeUser
	}

	public async fetchUserWithProjects(id: number): Promise<User> {
		return (await this.dataSource.getRepository(User).find({where: {id: id}, relations:{ownedProjects: true, joinedProjects: true}}))[0]
	}

	public async joinProject(userId: number, projectId: number): Promise<Project> {
		const user = await this.lookupUserById(userId)
		const project = await this.lookupProjectById(projectId)
		user.addJoinedProject(project)
		project.addTeamMember(user)
		await this.save(user)
		await this.save(project)
		return project
	}

	///// Project Methods /////

	public async createNewProject(userId: number, projectName: string): Promise<Project> {
		const user = await this.lookupUserById(userId)
		const newProject = new Project()
		newProject.name = projectName
		newProject.productOwner = user
		user.addOwnedProject(newProject)
		await this.save(user)
		await this.save(newProject)
		return newProject
	}

	public async updateProject(id: number, name?: string,): Promise<Project> {
		const project = await this.lookupProjectById(id)
		project.name = name ?? project.name
		await this.save(project)
		return project
	}

	public async lookupProjectById(id: number): Promise<Project> {
		return await this.dataSource.manager.findOneBy(Project, {id: id});
	}

	public async lookupProjectByIdWithUsers(id: number): Promise<Project> {
		return (await this.dataSource.getRepository(Project).find({where: {id: id}, relations:{productOwner: true, teamMembers: true}}))[0]
	}

	public async fetchProjectWithReleases(id: number): Promise<Project> {
		// Get the project with revisions' with only their numbers and dates
		// avoids getting the problem/goal statements and saves on data
		const project = await this.dataSource.getRepository(Project).createQueryBuilder("project")
			.where("project.id = :projectId", {projectId: id})
			.select(['project.id', 'release.revision', "release.revisionDate"])
			.leftJoin('project.releases', 'release')  // releases is the joined table
			.getMany();
		return project[0]
	}

	///// Release Methods /////

	// TODO

	///// Role Methods /////

	// TODO

	///// Sprint Methods /////

	// TODO

	///// Todo Methods /////

	// TODO

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
		const loadedProjects = await this.dataSource.getRepository(Project).find({
			relations: ['productOwner', 'teamMembers'],
			order: {
				name: "ASC"
			}
		});
		const loadedUsers = await this.dataSource.getRepository(User).find({
			relations: ['ownedProjects', 'joinedProjects'],
			order: {
				username: "ASC"
			}
		});
		for (const project of loadedProjects) { // many2many hard :(
			project.teamMembers = []
			await AppDataSource.manager.save(project)
		}
		for (const user of loadedUsers) {
			user.ownedProjects = []
			user.joinedProjects = []
			await AppDataSource.manager.save(user)
		}
		await this.dataSource.getRepository(Project).delete({})
		await this.dataSource.getRepository(User).delete({})
	}

}
