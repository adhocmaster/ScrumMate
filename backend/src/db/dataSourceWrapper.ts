import sprint from "router/sprint";
import { User } from "../entity/User";
import { BacklogItem, Story } from "../entity/backlogItem";
import { Project } from "../entity/project";
import { Release } from "../entity/release";
import { UserRole } from "../entity/roles";
import { Sprint } from "../entity/sprint";
import { DeletionError, NotFoundError, NotSavedError } from "../helpers/errors";
import { reverse } from "lodash"
import { DataSource, EntityTarget, FindManyOptions, ObjectLiteral } from "typeorm";

export class DataSourceWrapper {

	///// Initialization /////

	private dataSource?: DataSource = null

	public constructor(dataSource: DataSource) {
		this.dataSource = dataSource;
	}

	public get isInitialized(): boolean {
		return this.dataSource != null && this.dataSource.isInitialized;
	}

	///// User Methods /////

	public async lookupUserById(id: number): Promise<User> {
		const maybeUser = await this.dataSource.manager.findOneBy(User, {id: id});
		if (!maybeUser) {
			throw new NotFoundError(`User with id ${id} not found`)
		}
		return maybeUser
	}

	public async lookupUserByEmail(email: string): Promise<User> {
		const maybeUser = await this.dataSource.manager.findOneBy(User, {email: email});
		if (!maybeUser) {
			throw new NotFoundError(`User with email ${email} not found`)
		}
		return maybeUser
	}

	public async lookupUserBySessionToken(sessionToken: string): Promise<User> {
		const maybeUser = await this.dataSource.manager.findOneBy(User, {sessionToken: sessionToken});
			if (!maybeUser) {
				throw new NotFoundError(`User not found`)
			}
			return maybeUser;
	}

	public async fetchUserWithProjects(id: number): Promise<User> {
		const maybeUserList = await this.dataSource.getRepository(User).find({
			where: {id: id},
			relations:{
				ownedProjects: true,
				joinedProjects: true
			}})
		if (!maybeUserList || maybeUserList.length === 0) {
			throw new NotFoundError(`User with id ${id} not found`)
		}
		return maybeUserList[0]
	}

	///// Project Methods /////

	public async lookupProjectById(id: number): Promise<Project> {
		const maybeProject = await this.dataSource.manager.findOneBy(Project, {id: id});
		if (!maybeProject) {
			throw new NotFoundError(`Project with id ${id} not found`)
		}
		return maybeProject
	}

	public async lookupProjectByIdWithUsers(id: number): Promise<Project> {
		const maybeProject =  await this.dataSource.getRepository(Project).find({
			where: {id: id},
			relations:{
				productOwner: true,
				teamMembers: true
			}})
		if (!maybeProject || maybeProject.length === 0) {
			throw new NotFoundError(`Project with id ${id} not found`)
		}
		return maybeProject[0]
	}

	public async fetchProjectWithReleases(id: number): Promise<Project> {
		// Get the project with revisions' with only their numbers and dates
		// avoids getting the problem/goal statements and saves on data
		const maybeProject = await this.dataSource.getRepository(Project).createQueryBuilder("project")
			.where("project.id = :projectId", {projectId: id})
			.select(['project.id', 'release.id', 'release.revision', "release.revisionDate"])
			.leftJoin('project.releases', 'release')  // releases is the joined table
			.getMany();
		if (!maybeProject || maybeProject.length === 0) {
			throw new NotFoundError(`Project with id ${id} not found`)
		}
		reverse(maybeProject[0].releases) // may need to get from db in desc order instead
		return maybeProject[0]
	}

	public async fetchMostRecentRelease(id: number): Promise<Release> {
		return (await this.fetchProjectWithReleases(id)).releases[0]
	}

	///// Release Methods /////

	public async lookupReleaseById(id: number): Promise<Release> {
		const maybeRelease =  await this.dataSource.manager.findOneBy(Release, {id: id});
		if (!maybeRelease) {
			throw new NotFoundError(`Release with id ${id} not found`)
		}
		return maybeRelease
	}

	public async fetchReleaseWithProject(releaseId: number): Promise<Release> {
		const releaseWithProject = (await this.dataSource.getRepository(Release).find({
			where: {id: releaseId},
			relations:{
				project: true
			},
		}))
		if (!releaseWithProject || releaseWithProject.length === 0) {
			throw new NotFoundError(`Release with releaseId ${releaseId} not found`)
		}
		return releaseWithProject[0]
	}

	public async fetchReleaseWithSprints(releaseId: number): Promise<Release> {
		const releaseWithSprints = await this.dataSource.getRepository(Release).find({
			where: {id: releaseId},
			relations:{
				sprints: true,
			},
		})
		if (!releaseWithSprints || releaseWithSprints.length === 0) {
			throw new NotFoundError(`Release with releaseId ${releaseId} not found`)
		}
		return releaseWithSprints[0]
	}

	public async fetchReleaseWithBacklog(releaseId: number): Promise<Release> {
		const releaseWithSprints = await this.dataSource.getRepository(Release).find({
			where: {id: releaseId},
			relations:{
				backlog: true,
			},
		})
		if (!releaseWithSprints || releaseWithSprints.length === 0) {
			throw new NotFoundError(`Release with releaseId ${releaseId} not found`)
		}
		return releaseWithSprints[0]
	}

	///// Role Methods /////
	
	public async lookupRoleById(id: number): Promise<UserRole> {
		const maybeRole =  await this.dataSource.manager.findOneBy(UserRole, {id: id});
		if (!maybeRole) {
			throw new NotFoundError(`Role with id ${id} not found`)
		}
		return maybeRole
	}

	///// Sprint Methods /////
	
	public async lookupSprintById(id: number): Promise<Sprint> {
		const maybeSprint =  await this.dataSource.manager.findOneBy(Sprint, {id: id});
		if (!maybeSprint) {
			throw new NotFoundError(`Sprint with id ${id} not found`)
		}
		return maybeSprint
	}
	
	public async lookupSprintByIdWithRelease(id: number): Promise<Sprint> {
		const maybeSprint = await this.dataSource.getRepository(Sprint).find({
			where: {id: id},
			relations: {
				release: true // must sort by sprint.sprintNumber later
			},
		})
		if (!maybeSprint || maybeSprint.length === 0) {
			throw new NotFoundError(`Sprint with id ${id} not found`)
		}
		return maybeSprint[0]
	}
	
	public async lookupSprintByIdWithTodos(id: number): Promise<Sprint> {
		const maybeSprint = await this.dataSource.getRepository(Sprint).find({
			where: {id: id},
			relations: {
				todos: true // must sort by sprint.sprintNumber later
			},
		})
		if (!maybeSprint || maybeSprint.length === 0) {
			throw new NotFoundError(`Sprint with id ${id} not found`)
		}
		return maybeSprint[0]
	}
	
	public async moveSprintTodosToBacklog(releaseId: number, sprintId: number): Promise<void> {
		const maybeSprintWithTodos = await this.lookupSprintByIdWithTodos(sprintId);
		const maybeRelease = await this.dataSource.getRepository(Release).find({
			where: {id: releaseId},
			relations: {
				sprints: true,
				backlog: true
			}
		})
		if (!maybeRelease || maybeRelease.length === 0) {
			throw new NotFoundError(`Release with id ${releaseId} not found`)
		}
		maybeRelease[0].backlog = [...maybeSprintWithTodos.todos, ...maybeRelease[0].backlog]
		await this.save(maybeRelease)
		maybeSprintWithTodos.todos = []
		await this.save(maybeSprintWithTodos)
	}
	
	public async getSprintWithBacklog(releaseId: number): Promise<Sprint[]> {
		const sprints = await this.dataSource.getRepository(Sprint).find({
			relations:{
				release: true,
				todos: true,
			},
			where: {
				release: {id: releaseId}
			},
		})
		if (!sprints || sprints.length === 0) {
			throw new NotFoundError(`Release with releaseId ${releaseId} not found`)
		}
		return sprints;
	}
	
	// TODO: handle stories in the sprint
	// Maybe we can make it soft-delete if we ever implement undo feature
	public async deleteSprint(id: number): Promise<void> {
		try {
			await this.dataSource.getRepository(Sprint).delete(id)
		} catch (e) {
			console.log(e)
			throw new DeletionError(`Sprint with id ${id} failed to delete`)
		}
	}

	///// Todo Methods /////

	// TODO: more methods for stories, tasks, etc
	// Some details TBD because of sponsor saying avoid duplication of data
	public async lookupBacklogById(id: number): Promise<BacklogItem> {
		const maybeBacklog =  await this.dataSource.manager.findOneBy(BacklogItem, {id: id});
		if (!maybeBacklog) {
			throw new NotFoundError(`BacklogItem with id ${id} not found`)
		}
		return maybeBacklog
	}
	
	public async lookupStoryById(id: number): Promise<Story> {
		const maybeStory = (await this.lookupBacklogById(id));
		if (maybeStory instanceof Story) {
			return maybeStory;
		}
		throw new NotFoundError(`Story with id ${id} not found`)
	}

	///// General Methods - Only use if there is not a method above to use /////

	public async save(item: any) {
		try {
			return await this.dataSource.manager.save(item);
		} catch {
			throw new NotSavedError(`Failed to save ${item}`)
		}
	}

	public async find(entity: EntityTarget<ObjectLiteral>, findOptions: FindManyOptions<ObjectLiteral>) {
		const result = await this.dataSource.manager.find(entity, findOptions)
		if (!result) {
			throw new NotFoundError(`Find failed: ${entity} with ${findOptions} not found`)
		}
		return result
	}

	public async lookupById(type: any, id: number) { // issues with type :(
		const maybeItem =  await this.dataSource.manager.findOneBy(type, {id: id});
		if (!maybeItem) {
			throw new NotFoundError(`${type} with id ${id} not found`)
		}
		return maybeItem
	}

	public async deleteAll(): Promise<void> {
		const loadedReleases = await this.dataSource.getRepository(Release).find({
			relations: ['project', 'sprints', 'backlog'],
		});
		const loadedProjects = await this.dataSource.getRepository(Project).find({
			relations: ['productOwner', 'teamMembers'],
		});
		const loadedUsers = await this.dataSource.getRepository(User).find({
			relations: ['ownedProjects', 'joinedProjects'],
		});
		await this.dataSource.getRepository(UserRole).delete({})
		await this.dataSource.getRepository(BacklogItem).delete({})
		await this.dataSource.getRepository(Sprint).delete({})
		for (const release of loadedReleases) { // many2many hard :(
			delete release.project
			release.sprints = []
			release.backlog = []
			await this.dataSource.manager.save(release)
		}
		await this.dataSource.getRepository(Release).delete({})
		for (const project of loadedProjects) { // many2many hard :(
			project.teamMembers = []
			await this.dataSource.manager.save(project)
		}
		for (const user of loadedUsers) {
			user.ownedProjects = []
			user.joinedProjects = []
			await this.dataSource.manager.save(user)
		}
		await this.dataSource.getRepository(Project).delete({})
		await this.dataSource.getRepository(User).delete({})
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
