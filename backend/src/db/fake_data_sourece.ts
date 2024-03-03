import { User } from "../entity/User";
import { BacklogItem, Story } from "../entity/backlogItem";
import { Project } from "../entity/project";
import { Release } from "../entity/release";
import { UserRole } from "../entity/roles";
import { Sprint } from "../entity/sprint";
import { NotFoundError, NotSavedError } from "../helpers/errors";
import { reverse } from "lodash"
import { DataSource } from "typeorm";

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

	public constructor(dataSource?: DataSource) {
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

	public lookupUserById(id: number): User {
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

	public lookupUserByEmail(email: string): User {
		const maybeUser = this.userList.find(i => i.email === email);
		if (!maybeUser) {
			throw new NotFoundError(`User with email ${email} not found`)
		}
		// delete maybeUser.joinedProjects
		// delete maybeUser.ownedProjects
		// delete maybeUser.assignments
		return maybeUser
	}

	public lookupUserBySessionToken(sessionToken: string): User {
		const maybeUser = this.userList.find(i => i.sessionToken === sessionToken);
		if (!maybeUser) {
			throw new NotFoundError(`User not found`)
		}
		// delete maybeUser.joinedProjects
		// delete maybeUser.ownedProjects
		// delete maybeUser.assignments
		return maybeUser;
	}

	public fetchUserWithProjects(id: number): User {
		const maybeUser = this.userList.find(i => i.id === id);
		if (!maybeUser) {
			throw new NotFoundError(`User with id ${id} not found`)
		}
		// delete maybeUser.joinedProjects
		// delete maybeUser.ownedProjects
		return maybeUser
	}

	///// Project Methods /////

	public lookupProjectById(id: number): Project {
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

	public lookupProjectByIdWithUsers(id: number): Project {
		const maybeProject = this.projectList.find(i => i.id === id);
		if (!maybeProject) {
			throw new NotFoundError(`Project with id ${id} not found`)
		}
		// delete maybeProject.productOwner
		// delete maybeProject.teamMembers
		return maybeProject
	}

	public fetchProjectWithReleases(id: number): Project {
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

	public fetchMostRecentRelease(id: number): Release {
		return this.fetchProjectWithReleases(id).releases[0]
	}

	///// Release Methods /////

	public lookupReleaseById(id: number): Release {
		const maybeRelease = this.releaseList.find(i => i.id === id);
		if (!maybeRelease) {
			throw new NotFoundError(`Release with id ${id} not found`)
		}
		// delete maybeRelease.project
		// delete maybeRelease.sprints
		// delete maybeRelease.backlog
		return maybeRelease
	}

	public lookupReleaseWithProject(releaseId: number): Release {
		const maybeRelease = this.releaseList.find(i => i.id === releaseId);
		if (!maybeRelease) {
			throw new NotFoundError(`Release with id ${releaseId} not found`)
		}
		// delete maybeRelease.sprints
		// delete maybeRelease.backlog
		return maybeRelease
	}

	///// Role Methods /////
	
	public lookupRoleById(id: number): UserRole {
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
	
	public lookupSprintById(id: number): Sprint {
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
	public lookupBacklogById(id: number): BacklogItem {
		const maybeBacklog = this.backlogItemList.find(i => i.id === id);
		if (!maybeBacklog) {
			throw new NotFoundError(`BacklogItem with id ${id} not found`)
		}
		// delete maybeBacklog.release
		// delete maybeBacklog.sprint
		// delete maybeBacklog.assignees
		return maybeBacklog
	}
	
	public lookupStoryById(id: number): Story {
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
	public save(item: UserRole | Sprint | BacklogItem | User | Project | Release) {
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
						this.userList.push(item)
					}
				}
			} else if (item instanceof Project) {
				if (!item.id) {
					item.id = this.projectIdNext++
					this.projectList.push(item)
				} else {
					const index = this.projectList.findIndex(u => u.id === item.id);
					if (index !== -1) {
						this.projectList[index] = item;
					} else {
						this.projectList.push(item)
					}
				}
			} else if (item instanceof Release) {
				if (!item.id) {
					item.id = this.releaseIdNext++
					this.releaseList.push(item)
				} else {
					const index = this.releaseList.findIndex(u => u.id === item.id);
					if (index !== -1) {
						this.releaseList[index] = item;
					} else {
						this.releaseList.push(item)
					}
				}
			} else if (item instanceof Sprint) {
				if (!item.id) {
					item.id = this.sprintIdNext++
					this.sprintList.push(item)
				} else {
					const index = this.sprintList.findIndex(u => u.id === item.id);
					if (index !== -1) {
						this.sprintList[index] = item;
					} else {
						this.sprintList.push(item)
					}
				}
			} else if (item instanceof UserRole) {
				if (!item.id) {
					item.id = this.roleIdNext++
					this.roleList.push(item)
				} else {
					const index = this.roleList.findIndex(u => u.id === item.id);
					if (index !== -1) {
						this.roleList[index] = item;
					} else {
						this.roleList.push(item)
					}
				}
			} else if (item instanceof BacklogItem) {
				if (!item.id) {
					item.id = this.backlogItemIdNext++
					this.backlogItemList.push(item)
				} else {
					const index = this.backlogItemList.findIndex(u => u.id === item.id);
					if (index !== -1) {
						this.backlogItemList[index] = item;
					} else {
						this.backlogItemList.push(item)
					}
				}
			} else if (!item) {
				// do nothing?
				console.log("item is not there")
			} else {
				console.log("throwing error cuz not a type")
				throw new Error("Type not recognized")
			}
		return item
		} catch {
			throw new NotSavedError(`Failed to save ${item}`)
		}
	}

	// hopefully we wont need this method
	// public find(entity: EntityTarget<ObjectLiteral>, findOptions: FindManyOptions<ObjectLiteral>) {
	// 	if (entity ==== User) {
	// 		return this.lo
	// 	}
	// }

	public deleteAll(): void {
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
