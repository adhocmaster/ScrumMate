import { User } from "../entity/User"
import { Project } from "../entity/project"
import { Release } from "../entity/release"
import { UserRole } from "../entity/roles"
import { Sprint } from "../entity/sprint"
import { DataSource, EntityTarget, FindManyOptions, ObjectLiteral } from "typeorm"
import { Story, BacklogItem, Priority } from "../entity/backlogItem"
import "reflect-metadata"
import { DataSourceWrapper } from "./dataSourceWrapper"
import { AppDataSource } from "../data-source"
import { UserRepository } from "./repositories/userRepository"
import { ProjectRepository } from "./repositories/projectRepository"
import { ReleaseRepository } from "./repositories/releaseRepository"
import { SprintRepository } from "./repositories/sprintRepository"
import { UserRoleRepository } from "./repositories/roleRepository"
import { BacklogItemRepository } from "./repositories/backlogItemRepository"

export class Database {

	///// Initialization /////

	private static instance: Database;
	private dataSource: DataSourceWrapper | null = null;
	private userRepository: UserRepository;
	private projectRepository: ProjectRepository;
	private releaseRepository: ReleaseRepository;
	private sprintRepository: SprintRepository;
	private roleRepository: UserRoleRepository;
	private backlogItemRepository: BacklogItemRepository;

	private constructor(dataSource: DataSourceWrapper | DataSource) { // can assume initialized
		if (dataSource instanceof DataSourceWrapper)
			this.dataSource = dataSource;
		else if (dataSource instanceof DataSource)
			this.dataSource = new DataSourceWrapper(AppDataSource);

		this.userRepository = new UserRepository(this.dataSource);
		this.projectRepository = new ProjectRepository(this.dataSource);
		this.releaseRepository = new ReleaseRepository(this.dataSource);
		this.sprintRepository = new SprintRepository(this.dataSource);
		this.roleRepository = new UserRoleRepository(this.dataSource);
		this.backlogItemRepository = new BacklogItemRepository(this.dataSource);
	}

	public static getInstance(): Database {
		if (!Database.instance) {
			throw new Error("Database is not initialized! Use setAndGetInstance first.");
		}
		return Database.instance;
	}

	public static setAndGetInstance(dataSource: DataSourceWrapper | DataSource): Database {
		if (!Database.instance) {
			if (!dataSource.isInitialized)
				throw new Error("Database's DataSource is not initialized! Use setAndGetInstance first.");
			Database.instance = new Database(dataSource);
		}
		return Database.instance;
	}

	public get databaseIsInitialized(): boolean {
		return Database.instance != null;
	}

	public get dataSourceIsInitialized(): boolean {
		return this.dataSource != null && this.dataSource.isInitialized;
	}

	///// User Methods /////
	
	public async createNewUser(username: string, email: string, password: string, salt?: string, sessionToken?: string): Promise<User> {
		return await this.userRepository.createNewUser(username, email, password, salt, sessionToken);
	}

	public async updateUser(id: number, username?: string, email?: string, password?: string, salt?: string, sessionToken?: string): Promise<User> {
		return await this.userRepository.updateUser(id, username, email, password, salt, sessionToken);

	}

	public async joinProject(userId: number, projectId: number): Promise<Project> {
		return await this.userRepository.joinProject(userId, projectId);
	}

	public async lookupUserById(id: number): Promise<User> {
		return await this.dataSource.lookupUserById(id);
	}

	public async lookupUserByEmail(email: string): Promise<User> {
		return await this.dataSource.lookupUserByEmail(email);

	}

	public async lookupUserBySessionToken(sessionToken: string): Promise<User> {
		return await this.dataSource.lookupUserBySessionToken(sessionToken);

	}

	public async fetchUserWithProjects(id: number): Promise<User> {
		return await this.dataSource.fetchUserWithProjects(id);

	}

	///// Project Methods /////

	public async createNewProject(userId: number, projectName: string): Promise<Project> {
		return await this.projectRepository.createNewProject(userId, projectName);
	}

	public async updateProject(id: number, name?: string,): Promise<Project> {
		return await this.projectRepository.updateProject(id, name);
	}

	public async lookupProjectById(id: number): Promise<Project> {
		return await this.dataSource.lookupProjectById(id);
	}

	public async lookupProjectByIdWithUsers(id: number): Promise<Project> {
		return await this.dataSource.lookupProjectByIdWithUsers(id);
	}

	public async fetchProjectWithReleases(id: number): Promise<Project> {
		return await this.dataSource.fetchProjectWithReleases(id);
	}

	public async fetchMostRecentRelease(id: number): Promise<Release> {
		return await this.dataSource.fetchMostRecentRelease(id);
	}

	///// Release Methods /////

	/// correctly automatically generates new revision if not provided
	public async createNewRelease(projectId: number, revision?: number, revisionDate?: Date, problemStatement?: string, goalStatement?: string): Promise<Release> {
		return await this.releaseRepository.createNewRelease(projectId, revision, revisionDate, problemStatement, goalStatement);
	}

	public async updateRelease(releaseId: number, revisionDate?: Date, problemStatement?: string, goalStatement?: string): Promise<Release> {
		return await this.releaseRepository.updateRelease(releaseId, revisionDate, problemStatement, goalStatement);
	}

	/// Copies the columns only, but not the relations. TODO: copy relations
	public async copyRelease(releaseId: number): Promise<Release> {
		return await this.releaseRepository.copyRelease(releaseId);
	}

	public async getReleaseSprints(releaseId: number): Promise<Sprint[]> {
		return await this.releaseRepository.getReleaseSprints(releaseId)
	}

	public async reorderSprints(releaseId: number, startIndex: number, destinationIndex: number): Promise<Sprint[]> {
		return await this.releaseRepository.reorderSprints(releaseId, startIndex, destinationIndex)
	}

	public async removeSprintFromRelease(sprintId: number): Promise<Sprint[]> {
		return await this.releaseRepository.removeSprintFromRelease(sprintId);
	}

	public async lookupReleaseById(id: number): Promise<Release> {
		return await this.dataSource.lookupReleaseById(id);
	}

	public async fetchReleaseWithProject(releaseId: number): Promise<Release> {
		return await this.dataSource.fetchReleaseWithProject(releaseId);
	}

	public async fetchReleaseWithBacklog(releaseId: number): Promise<Release> {
		return await this.dataSource.fetchReleaseWithBacklog(releaseId);
	}

	public async fetchReleaseWithSprints(releaseId: number): Promise<Release> {
		return await this.dataSource.fetchReleaseWithSprints(releaseId);
	}

	///// Role Methods /////

	public async createNewRole(userId: number, sprintId: number, role: string): Promise<UserRole> {
		return await this.roleRepository.createNewRole(userId, sprintId, role);
	}

	public async updateRole(roleId: number, userId: number, role?: string): Promise<UserRole> {
		return await this.roleRepository.updateRole(roleId, userId, role);
	}

	public async lookupRoleById(id: number): Promise<UserRole> {
		return await this.dataSource.lookupRoleById(id);
	}

	///// Sprint Methods /////
	
	public async createNewSprint(releaseId: number, sprintNumber: number, startDate: Date, endDate: Date, goal: string): Promise<Sprint> {
		return await this.sprintRepository.createNewSprint(releaseId, sprintNumber, startDate, endDate, goal);
	}

	public async updateSprint(sprintId: number, sprintNumber?: number, startDate?: Date, endDate?: Date, goal?: string): Promise<Sprint> {
		return await this.sprintRepository.updateSprint(sprintId, sprintNumber, startDate, endDate, goal);
	}
		
	public async lookupSprintById(id: number): Promise<Sprint> {
		return await this.dataSource.lookupSprintById(id);
	}
	
	public async lookupSprintByIdWithRelease(id: number): Promise<Sprint> {
		return await this.dataSource.lookupSprintByIdWithRelease(id);
	}
	
	public async lookupSprintByIdWithTodos(id: number): Promise<Sprint> {
		return await this.dataSource.lookupSprintByIdWithTodos(id);
	}
	
	public async moveSprintTodosToBacklog(releaseId: number, sprintId: number): Promise<void> {
		return await this.dataSource.moveSprintTodosToBacklog(releaseId, sprintId);
	}
	
	public async getSprintWithBacklog(releaseId: number): Promise<Sprint[]> {
		return await this.dataSource.getSprintWithBacklog(releaseId);
	}
	
	public async deleteSprint(id: number): Promise<void> {
		return await this.dataSource.deleteSprint(id);
	}

	///// BacklogItem Methods /////

	public async createNewStory(sprintId: number, userTypes: string, functionalityDescription: string, reasoning: string, acceptanceCriteria: string, storyPoints: number, priority: Priority): Promise<Story> {
		return await this.backlogItemRepository.createNewStory(sprintId, userTypes, functionalityDescription, reasoning, acceptanceCriteria, storyPoints, priority);
	}

	public async updateStory(storyId: number, sprintId?: number, userTypes?: string, functionalityDescription?: string, reasoning?: string, acceptanceCriteria?: string, storyPoints?: number, priority?: Priority): Promise<Story> {
		return await this.backlogItemRepository.updateStory(storyId, sprintId, userTypes, functionalityDescription, reasoning, acceptanceCriteria, storyPoints, priority);
	}

	public async lookupBacklogById(id: number): Promise<BacklogItem> {
		return await this.dataSource.lookupBacklogById(id)
	}
	
	public async lookupStoryById(id: number): Promise<Story> {
		return await this.dataSource.lookupStoryById(id)
	}

	///// General Methods - Only use if there is not a method above to use /////

	public async save(item: any) {
		return await this.dataSource.save(item);
	}
	
	public async find(entity: EntityTarget<ObjectLiteral>, findOptions: FindManyOptions<ObjectLiteral>) {
		return await this.dataSource.find(entity, findOptions);
	}

	public async deleteAll(): Promise<void> {
		await this.dataSource.deleteAll();
	}

	// /// Like save, but guaranteed to not exist in the db
	// /// for performance purposes
	// /// WARNING: behaves differently than save somehow... doesnt save into original entity?
	// public async insert(item: User | Project | Release | UserRole | Sprint | BacklogItem) {
	// }

	// /// Like save, but guaranteed to already exist in the db
	// public async update(item: User | Project | Release | UserRole | Sprint | BacklogItem) {
	// }

	// public async findBy(entity: EntityTarget<ObjectLiteral>, findWhereOptions: FindOptionsWhere<ObjectLiteral> | FindOptionsWhere<ObjectLiteral>[]) {
	// }

}
