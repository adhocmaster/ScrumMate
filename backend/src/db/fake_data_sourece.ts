import { User } from "../entity/User";
import { BacklogItem, Story } from "../entity/backlogItem";
import { Project } from "../entity/project";
import { Release } from "../entity/release";
import { UserRole } from "../entity/roles";
import { Sprint } from "../entity/sprint";
import { NotFoundError, NotSavedError } from "../helpers/errors";
import { reverse } from "lodash"
import { DataSource, EntityTarget, FindManyOptions, ObjectLiteral } from "typeorm";

export class DataSourceWrapper {
	userList: User[]
	userIdNext: number = 1
	projectList: Project[]
	projectIdNext: number = 1
	releaseList: Release[]
	releaseIdNext: number = 1
	sprintList: Sprint[]
	sprintIdNext: number = 1
	roleList: UserRole[]
	roleIdNext: number = 1
	backlogItemList: BacklogItem[]
	backlogItemIdNext: number = 1

	///// Initialization /////

	public constructor(dataSource: DataSource) {
		this.userList = []
		this.userIdNext = 1
		this.projectList = []
		this.projectIdNext = 1
		this.releaseList = []
		this.releaseIdNext = 1
		this.sprintList = []
		this.sprintIdNext = 1
		this.roleList = []
		this.roleIdNext = 1
		this.backlogItemList = []
		this.backlogItemIdNext = 1
	}

	public get isInitialized(): boolean {
		return true;
	}

	///// User Methods /////

	public async lookupUserById(id: number): Promise<User> {
		console.log(id)
		console.log(this.userList)
		const maybeUser = this.userList.find(i => i.id === id);
		if (!maybeUser) {
			throw new NotFoundError(`User with id ${id} not found`)
		}
		// delete maybeUser.joinedProjects
		// delete maybeUser.ownedProjects
		// delete maybeUser.assignments
		return maybeUser
	}

	public async lookupUserByEmail(email: string): Promise<User> {
		const maybeUser = this.userList.find(i => i.email === email);
		if (!maybeUser) {
			throw new NotFoundError(`User with email ${email} not found`)
		}
		// delete maybeUser.joinedProjects
		// delete maybeUser.ownedProjects
		// delete maybeUser.assignments
		return maybeUser
	}

	public async lookupUserBySessionToken(sessionToken: string): Promise<User> {
		const maybeUser = this.userList.find(i => i.sessionToken === sessionToken);
		if (!maybeUser) {
			throw new NotFoundError(`User not found`)
		}
		// delete maybeUser.joinedProjects
		// delete maybeUser.ownedProjects
		// delete maybeUser.assignments
		return maybeUser;
	}

	public async fetchUserWithProjects(id: number): Promise<User> {
		const maybeUser = this.userList.find(i => i.id === id);
		if (!maybeUser) {
			throw new NotFoundError(`User with id ${id} not found`)
		}
		// delete maybeUser.joinedProjects
		// delete maybeUser.ownedProjects
		return maybeUser
	}

	///// Project Methods /////

	public async lookupProjectById(id: number): Promise<Project> {
		const maybeProject = this.projectList.find(i => i.id === id);
		if (!maybeProject) {
			throw new NotFoundError(`Project with id ${id} not found`)
		}
		// delete maybeProject.productOwner
		// delete maybeProject.teamMembers
		// delete maybeProject.releases
		// delete maybeProject.roles
		return maybeProject
	}

	public async lookupProjectByIdWithUsers(id: number): Promise<Project> {
		const maybeProject = this.projectList.find(i => i.id === id);
		if (!maybeProject) {
			throw new NotFoundError(`Project with id ${id} not found`)
		}
		// delete maybeProject.productOwner
		// delete maybeProject.teamMembers
		return maybeProject
	}

	public async fetchProjectWithReleases(id: number): Promise<Project> {
		const maybeProject = this.projectList.find(i => i.id === id);
		if (!maybeProject) {
			throw new NotFoundError(`Project with id ${id} not found`)
		}
		// delete maybeProject.productOwner
		// delete maybeProject.teamMembers
		// delete maybeProject.roles
		const releases = [...maybeProject.releases]
		releases.map((release) => {
			// delete release.problemStatement
			// delete release.goalStatement
			// delete release.project
			// delete release.sprints
			// delete release.backlog
		})
		reverse(maybeProject.releases) // may need to get from db in desc order instead
		return maybeProject
	}

	public async fetchMostRecentRelease(id: number): Promise<Release> {
		return (await this.fetchProjectWithReleases(id)).releases[0]
	}

	///// Release Methods /////

	public async lookupReleaseById(id: number): Promise<Release> {
		const maybeRelease = this.releaseList.find(i => i.id === id);
		if (!maybeRelease) {
			throw new NotFoundError(`Release with id ${id} not found`)
		}
		// delete maybeRelease.project
		// delete maybeRelease.sprints
		// delete maybeRelease.backlog
		return maybeRelease
	}

	public async lookupReleaseWithProject(releaseId: number): Promise<Release> {
		const maybeRelease = this.releaseList.find(i => i.id === releaseId);
		if (!maybeRelease) {
			throw new NotFoundError(`Release with id ${releaseId} not found`)
		}
		// delete maybeRelease.sprints
		// delete maybeRelease.backlog
		return maybeRelease
	}

	///// Role Methods /////
	
	public async lookupRoleById(id: number): Promise<UserRole> {
		const maybeRole = this.roleList.find(i => i.id === id);
		if (!maybeRole) {
			throw new NotFoundError(`Role with id ${id} not found`)
		}
		// delete maybeRole.user
		// delete maybeRole.sprint
		// delete maybeRole.project
		return maybeRole
	}

	///// Sprint Methods /////
	
	public async lookupSprintById(id: number): Promise<Sprint> {
		const maybeSprint = this.sprintList.find(i => i.id === id);
		if (!maybeSprint) {
			throw new NotFoundError(`Sprint with id ${id} not found`)
		}
		// delete maybeSprint.scrumMaster
		// delete maybeSprint.release
		// delete maybeSprint.todos
		// delete maybeSprint.roles
		return maybeSprint
	}

	///// Todo Methods /////

	// TODO: more methods for stories, tasks, etc
	// Some details TBD because of sponsor saying avoid duplication of data
	public async lookupBacklogById(id: number): Promise<BacklogItem> {
		const maybeBacklog = this.backlogItemList.find(i => i.id === id);
		if (!maybeBacklog) {
			throw new NotFoundError(`BacklogItem with id ${id} not found`)
		}
		// delete maybeBacklog.release
		// delete maybeBacklog.sprint
		// delete maybeBacklog.assignees
		return maybeBacklog
	}
	
	public async lookupStoryById(id: number): Promise<Story> {
		const maybeStory = this.backlogItemList.find(i => i.id === id);
		if (!maybeStory) {
			throw new NotFoundError(`BacklogItem with id ${id} not found`)
		}
		// delete maybeStory.release
		// delete maybeStory.sprint
		// delete maybeStory.assignees
		if (!(maybeStory instanceof Story))
			throw new Error("not story")
		return maybeStory
	}

	///// General Methods - Only use if there is not a method above to use /////

	// must give it an id...
	public async save(item: UserRole | Sprint | BacklogItem | User | Project | Release) {
		try {
			if (item instanceof User) {
				console.log(`saving ${item.id}`)
				console.log(`userList ${this.userList.map((item) => item.id)}`)
				if (!item.id) {
					item.id = this.userIdNext++
					this.userList.push(item)
				} else {
					const index = this.userList.findIndex(u => u.id === item.id);
					if (index !== -1) {
						this.userList[index] = item;
					} else {
						throw new NotFoundError(`User with id ${item.id} not found`);
					}
				}
			} else if (item instanceof Project) {
				if (!item.id) {
					item.id = this.projectIdNext++
				}
				this.projectList.push(item)
			} else if (item instanceof Release) {
				if (!item.id) {
					item.id = this.releaseIdNext++
				}
				this.releaseList.push(item)
			} else if (item instanceof Sprint) {
				if (!item.id) {
					item.id = this.sprintIdNext++
				}
				this.sprintList.push(item)
			} else if (item instanceof UserRole) {
				if (!item.id) {
					item.id = this.roleIdNext++
				}
				this.roleList.push(item)
			} else if (item instanceof BacklogItem) {
				if (!item.id) {
					item.id = this.backlogItemIdNext++
				}
				this.backlogItemList.push(item)
			} else if (!item) {
				// do nothing?
				console.log("item is not there")
			} else {
				throw new Error("Type not recognized")
			}
		return item
		} catch {
			throw new NotSavedError(`Failed to save ${item}`)
		}
	}

	// hopefully we wont need this method
	// public async find(entity: EntityTarget<ObjectLiteral>, findOptions: FindManyOptions<ObjectLiteral>) {
	// 	if (entity ==== User) {
	// 		return this.lo
	// 	}
	// }

	public async deleteAll(): Promise<void> {
		this.userList = []
		this.userIdNext = 1
		this.projectList = []
		this.projectIdNext = 1
		this.releaseList = []
		this.releaseIdNext = 1
		this.sprintList = []
		this.sprintIdNext = 1
		this.roleList = []
		this.roleIdNext = 1
		this.backlogItemList = []
		this.backlogItemIdNext = 1
	}
}
