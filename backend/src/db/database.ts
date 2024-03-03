import { User } from "../entity/User"
import { Project } from "../entity/project"
import { Release } from "../entity/release"
import { UserRole } from "../entity/roles"
import { Sprint } from "../entity/sprint"
import { EntityTarget, FindManyOptions, FindOptionsWhere, ObjectLiteral, QueryFailedError } from "typeorm"
import { Bug, Epic, Infrastructure, Spike, Story, Task, BacklogItem, Priority } from "../entity/backlogItem"
import { authentication, random } from "../helpers"
import "reflect-metadata"
import { ExistingUserError, NotFoundError, NotSavedError } from "../helpers/errors"
import { reverse } from "lodash"
import { DataSourceWrapper } from "./data_source_wrapper"

export class Database {

	///// Initialization /////

	private static instance: Database;
	private dataSource: DataSourceWrapper | null = null

	private constructor(dataSource: DataSourceWrapper) {
		this.dataSource = dataSource;
	}

	public static getInstance(): Database {
		if (!Database.instance) {
			throw new Error("Database is not initialized! Use setAndGetInstance first.")
		}
		return Database.instance;
	}

	public static setAndGetInstance(dataSource: DataSourceWrapper): Database {
		if (!Database.instance) {
			if (!dataSource.isInitialized)
				throw new Error("Database's DataSource is not initialized! Use setAndGetInstance first.")
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

	///// Project Methods /////

	public async createNewProject(userId: number, projectName: string): Promise<Project> {
		const user = await this.dataSource.lookupUserById(userId)
		const newProject = new Project()
		newProject.name = projectName
		newProject.nextRevision = 1
		newProject.productOwner = user
    newProject.releases = [];
		// user.addOwnedProject(newProject)
		// await this.save(user) // DO NOT DO THIS! if dont fetch all old projects, saving just 1 project erases
		await this.save(newProject)
    // await this.save(user);
		return newProject
	}

	public async updateProject(id: number, name?: string,): Promise<Project> {
		const project = await this.dataSource.lookupProjectById(id)
		project.name = name ?? project.name
		await this.save(project)
		return project
	}

	///// Release Methods /////

	/// correctly automatically generates new revision if not provided
	public async createNewRelease(projectId: number, revision?: number, revisionDate?: Date, problemStatement?: string, goalStatement?: string): Promise<Release> {
		const project = await this.dataSource.lookupProjectById(projectId)
		const release = new Release()
		release.project = project 
		if (!revision) {
			revision = project.nextRevision
			project.nextRevision = project.nextRevision + 1
			await this.save(project)
		}
		release.revision = revision
		release.revisionDate = revisionDate ?? new Date()
		release.problemStatement = problemStatement ?? ""
		release.goalStatement = goalStatement ?? ""
		await this.save(release)
		return release
	}

	public async updateRelease(releaseId: number, revisionDate?: Date, problemStatement?: string, goalStatement?: string): Promise<Release> {
		const release = await this.dataSource.lookupReleaseById(releaseId)
		// const releaseWithProject = await this.dataSource.lookupReleaseWithProject(releaseId)
		// release.revision = revision ?? release.revision // shouldnt change
		release.revisionDate = revisionDate ?? release.revisionDate
		release.problemStatement = problemStatement ?? release.problemStatement
		release.goalStatement = goalStatement ?? release.goalStatement
		await this.save(release)
		return release
	}

	/// Copies the columns only, but not the relations. TODO: copy relations
	public async copyRelease(releaseId: number): Promise<Release> {
		const releaseCopy = new Release();
		// need to get the whole list of releases in this project so we can get the new version #
		// should we just make a new variable to count the max version
		const releaseWithProject = await this.dataSource.lookupReleaseWithProject(releaseId)
		releaseCopy.copy(releaseWithProject)
		releaseCopy.revision = releaseCopy.project.nextRevision;
		releaseCopy.project.nextRevision += 1;
		await this.save(releaseCopy.project)
		await this.save(releaseCopy)
		return releaseCopy
	}

	///// Role Methods /////

	public async createNewRole(userId: number, sprintId: number, role: string): Promise<UserRole> {
		const user = await this.dataSource.lookupUserById(userId)
		const sprint = await this.dataSource.lookupSprintById(sprintId)
		const newRole = new UserRole()
		newRole.role = role
		newRole.user = user
		newRole.sprint = sprint
		await this.save(newRole)
		return newRole
	}

	public async updateRole(roleId: number, userId: number, role?: string): Promise<UserRole> {
		const userRole = await this.dataSource.lookupRoleById(roleId)
		const user = await this.dataSource.lookupUserById(userId)
		userRole.role = role ?? userRole.role
		userRole.user = user ?? userRole.user // may break if relational not loaded?
		await this.save(userRole)
		return userRole
	}

	///// Sprint Methods /////
	
	public async createNewSprint(releaseId: number, sprintNumber: number, startDate: Date, endDate: Date, goal: string): Promise<Sprint> {
		const release = await this.dataSource.lookupReleaseById(releaseId)
		const newSprint = new Sprint()
		newSprint.sprintNumber = sprintNumber
		newSprint.startDate = startDate
		newSprint.endDate = endDate
		newSprint.goal = goal
		newSprint.release = release
		// release.addSprint(newSprint)
		await this.save(newSprint)
		return newSprint
	}

	public async updateSprint(sprintId: number, sprintNumber?: number, startDate?: Date, endDate?: Date, goal?: string): Promise<Sprint> {
		const sprint = await this.dataSource.lookupSprintById(sprintId)
		sprint.sprintNumber = sprintNumber ?? sprint.sprintNumber
		sprint.startDate = startDate ?? sprint.startDate
		sprint.endDate = endDate ?? sprint.endDate
		sprint.goal = goal ?? sprint.goal
		await this.save(sprint)
		return sprint
	}

	///// Todo Methods /////

	public async createNewStory(sprintId: number, userTypes: string, functionalityDescription: string, reasoning: string, acceptanceCriteria: string, storyPoints: number, priority: Priority): Promise<Story> {
		const sprint = await this.dataSource.lookupSprintById(sprintId)
		const newStory = new Story()
		newStory.userTypes = userTypes
		newStory.functionalityDescription = functionalityDescription
		newStory.reasoning = reasoning
		newStory.acceptanceCriteria = acceptanceCriteria
		newStory.storyPoints = storyPoints
		newStory.priority = priority
		newStory.sprint = sprint
		// sprint.addTODO(newStory) // not sure if need to do. need to load sprint's relation?
		await this.save(newStory)
		return newStory
	}

	public async updateStory(storyId: number, sprintId?: number, userTypes?: string, functionalityDescription?: string, reasoning?: string, acceptanceCriteria?: string, storyPoints?: number, priority?: Priority): Promise<Story> {
		const sprint = await this.dataSource.lookupSprintById(sprintId)
		const story = await this.dataSource.lookupStoryById(storyId)
		story.userTypes = userTypes ?? story.userTypes
		story.functionalityDescription = functionalityDescription ?? story.functionalityDescription
		story.reasoning = reasoning ?? story.reasoning
		story.acceptanceCriteria = acceptanceCriteria ?? story.acceptanceCriteria
		story.storyPoints = storyPoints ?? story.storyPoints
		story.priority = priority ?? story.priority
		// if (sprint) {
		//   story.sprint.removeTODO(story) // may need to fix the remove method, match on id
		//   story.sprint = sprint
		//   sprint.addTODO(story) // again, might break
		// }
		await this.save(story)
		return story;
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
	// 	try {
	// 		return await this.dataSource.manager.insert(typeof(item), item);
	// 	} catch {
	// 		throw new NotSavedError(`Failed to insert ${item}`)
	// 	}
	// }

	// /// Like save, but guaranteed to already exist in the db
	// /// for performance purposes
	// /// WARNING: behaves differently than save somehow...
	// public async update(item: User | Project | Release | UserRole | Sprint | BacklogItem) {
	// 	try {
	// 		return await this.dataSource.manager.update(typeof(item), item.id, item);
	// 	} catch {
	// 		throw new NotSavedError(`Failed to update ${item}`)
	// 	}
	// }

	// public async findBy(entity: EntityTarget<ObjectLiteral>, findWhereOptions: FindOptionsWhere<ObjectLiteral> | FindOptionsWhere<ObjectLiteral>[]) {
	// 	const result = await this.dataSource.manager.findBy(entity, findWhereOptions)
	// 	if (!result) {
	// 		throw new NotFoundError(`FindBy failed: ${entity} with ${findWhereOptions} not found`)
	// 	}
	// 	return result
	// }

}
