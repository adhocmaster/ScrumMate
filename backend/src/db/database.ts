import { DataSource } from "typeorm"
import { UserRepository } from "./repositories/userRepository"
import { ProjectRepository } from "./repositories/projectRepository"
import { ReleaseRepository } from "./repositories/releaseRepository"
import { SprintRepository } from "./repositories/sprintRepository"
import { UserRoleRepository } from "./repositories/roleRepository"
import { BacklogItemRepository } from "./repositories/backlogItemRepository"
import "reflect-metadata"
import { ModelDataSourceWrapper } from "./dataSourceWrappers/modelDataSourceWrapper"
import { UserDataSourceWrapper } from "./dataSourceWrappers/userDataSourceWrapper"
import { ProjectDataSourceWrapper } from "./dataSourceWrappers/projectDataSourceWrapper"
import { ReleaseDataSourceWrapper } from "./dataSourceWrappers/releaseDataSourceWrapper"
import { SprintDataSourceWrapper } from "./dataSourceWrappers/sprintDataSourceWrapper"
import { UserRoleDataSourceWrapper } from "./dataSourceWrappers/roleDataSourceWrapper"
import { BacklogItemDataSourceWrapper } from "./dataSourceWrappers/backlogItemDataSourceWrapper"

export class Database {

	///// Initialization /////

	private static instance: Database;

	private dataSource: ModelDataSourceWrapper | null = null;

	private userRepository: UserRepository;
	private projectRepository: ProjectRepository;
	private releaseRepository: ReleaseRepository;
	private sprintRepository: SprintRepository;
	private roleRepository: UserRoleRepository;
	private backlogItemRepository: BacklogItemRepository;

	private constructor(dataSource: DataSource) { // can assume initialized
		this.dataSource = new ModelDataSourceWrapper(dataSource);
		const dataSources = new Map<String, ModelDataSourceWrapper>([
			["user", new UserDataSourceWrapper(dataSource)],
			["project", new ProjectDataSourceWrapper(dataSource)],
			["release", new ReleaseDataSourceWrapper(dataSource)],
			["sprint", new SprintDataSourceWrapper(dataSource)],
			["role", new UserRoleDataSourceWrapper(dataSource)],
			["backlog", new BacklogItemDataSourceWrapper(dataSource)],
		])
		this.userRepository = new UserRepository(dataSources);
		this.projectRepository = new ProjectRepository(dataSources);
		this.releaseRepository = new ReleaseRepository(dataSources);
		this.sprintRepository = new SprintRepository(dataSources);
		this.roleRepository = new UserRoleRepository(dataSources);
		this.backlogItemRepository = new BacklogItemRepository(dataSources);
	}

	public static getInstance(): Database {
		if (!Database.instance) {
			throw new Error("Database is not initialized! Use setAndGetInstance first.");
		}
		return Database.instance;
	}

	public static setAndGetInstance(dataSource: DataSource): Database {
		if (!dataSource.isInitialized)
			throw new Error("Database's DataSource is not initialized! Use setAndGetInstance first.");
		Database.instance = new Database(dataSource);
		return Database.instance;
	}

	public get databaseIsInitialized(): boolean {
		return Database.instance != null;
	}

	public get dataSourceIsInitialized(): boolean {
		return this.dataSource != null && this.dataSource.dataSourceIsInitialized;
	}

	///// Get Repositories /////

	private checkInitialized() {
		if (!this.databaseIsInitialized) {
			throw new Error("Database is not initialized! Use setAndGetInstance first.")
		}
	}

	public get getUserRepository(): UserRepository {
		this.checkInitialized()
		return this.userRepository;
	}

	public get getProjectRepository(): ProjectRepository {
		this.checkInitialized()
		return this.projectRepository;
	}

	public get getReleaseRepository(): ReleaseRepository {
		this.checkInitialized()
		return this.releaseRepository;
	}

	public get getSprintRepository(): SprintRepository {
		this.checkInitialized()
		return this.sprintRepository;
	}

	public get getUserRoleRepository(): UserRoleRepository {
		this.checkInitialized()
		return this.roleRepository;
	}

	public get getBacklogItemRepository(): BacklogItemRepository {
		this.checkInitialized()
		return this.backlogItemRepository;
	}

	///// General Methods - Only use if there is not a method above to use /////

	public async save(item: any) {
		return await this.dataSource.save(item);
	}

	public async deleteAll(): Promise<void> {
		await this.dataSource.nuke();
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
