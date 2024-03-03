import { User } from "../entity/User";
import { BacklogItem, Story } from "../entity/backlogItem";
import { Project } from "../entity/project";
import { Release } from "../entity/release";
import { UserRole } from "../entity/roles";
import { Sprint } from "../entity/sprint";
import { NotFoundError, NotSavedError } from "../helpers/errors";
import { reverse } from "lodash"
import { DataSource, EntityTarget, FindManyOptions, ObjectLiteral } from "typeorm";

export class FakeDataSourceWrapper {
	typeMap: Map<any, any[]>
	typeNextIdMap: Map<any, number>

	///// Initialization /////

	public constructor(dataSource?: DataSource) {
		this.typeMap = new Map<any, any[]>([
			[User, []],
			[Project, []],
			[Release, []],
			[Sprint, []],
			[UserRole, []],
			[BacklogItem, []],
		])
		this.typeNextIdMap = new Map<any, number>([
			[User, 1],
			[Project, 1],
			[Release, 1],
			[Sprint, 1],
			[UserRole, 1],
			[BacklogItem, 1],
		])
	}

	public get isInitialized(): boolean {
		return true;
	}

	///// User Methods /////

	public lookupUserById(id: number): User {
		const maybeUser = this.typeMap.get(User).find(i => i.id === id);
		if (!maybeUser) {
			throw new NotFoundError(`User with id ${id} not found`)
		}
		// delete maybeUser.joinedProjects
		// delete maybeUser.ownedProjects
		// delete maybeUser.assignments
		return maybeUser
	}

	public lookupUserByEmail(email: string): User {
		const maybeUser = this.typeMap.get(User).find(i => i.email === email);
		if (!maybeUser) {
			throw new NotFoundError(`User with email ${email} not found`)
		}
		// delete maybeUser.joinedProjects
		// delete maybeUser.ownedProjects
		// delete maybeUser.assignments
		return maybeUser
	}

	public lookupUserBySessionToken(sessionToken: string): User {
		const maybeUser = this.typeMap.get(User).find(i => i.sessionToken === sessionToken);
		if (!maybeUser) {
			throw new NotFoundError(`User not found`)
		}
		// delete maybeUser.joinedProjects
		// delete maybeUser.ownedProjects
		// delete maybeUser.assignments
		return maybeUser;
	}

	public fetchUserWithProjects(id: number): User {
		const maybeUser = this.typeMap.get(User).find(i => i.id === id);
		if (!maybeUser) {
			throw new NotFoundError(`User with id ${id} not found`)
		}
		// delete maybeUser.joinedProjects
		// delete maybeUser.ownedProjects
		return maybeUser
	}

	///// Project Methods /////

	public lookupProjectById(id: number): Project {
		const maybeProject = this.typeMap.get(Project).find(i => i.id === id);
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
		const maybeProject = this.typeMap.get(Project).find(i => i.id === id);
		if (!maybeProject) {
			throw new NotFoundError(`Project with id ${id} not found`)
		}
		// delete maybeProject.productOwner
		// delete maybeProject.teamMembers
		return maybeProject
	}

	public fetchProjectWithReleases(id: number): Project {
		const maybeProject = this.typeMap.get(Project).find(i => i.id === id);
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
		const maybeRelease = this.typeMap.get(Release).find(i => i.id === id);
		if (!maybeRelease) {
			throw new NotFoundError(`Release with id ${id} not found`)
		}
		// delete maybeRelease.project
		// delete maybeRelease.sprints
		// delete maybeRelease.backlog
		return maybeRelease
	}

	public lookupReleaseWithProject(releaseId: number): Release {
		const maybeRelease = this.typeMap.get(Release).find(i => i.id === releaseId);
		if (!maybeRelease) {
			throw new NotFoundError(`Release with id ${releaseId} not found`)
		}
		// delete maybeRelease.sprints
		// delete maybeRelease.backlog
		return maybeRelease
	}

	///// Role Methods /////
	
	public lookupRoleById(id: number): UserRole {
		const maybeRole = this.typeMap.get(UserRole).find(i => i.id === id);
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
		const maybeSprint = this.typeMap.get(Sprint).find(i => i.id === id);
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
		const maybeBacklog = this.typeMap.get(BacklogItem).find(i => i.id === id);
		if (!maybeBacklog) {
			throw new NotFoundError(`BacklogItem with id ${id} not found`)
		}
		// delete maybeBacklog.release
		// delete maybeBacklog.sprint
		// delete maybeBacklog.assignees
		return maybeBacklog
	}
	
	public lookupStoryById(id: number): Story {
		const maybeStory = this.typeMap.get(BacklogItem).find(i => i.id === id);
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

	private saveUser(user: User) {
		if (!user.id) {
			user.id = this.typeNextIdMap.get(User)
			this.typeNextIdMap.set(User, this.typeNextIdMap.get(User)+1)
			this.typeMap.get(User).push(user)
		} else {
			const index = this.typeMap.get(User).findIndex(u => u.id === user.id);
			if (index !== -1) {
				this.typeMap.get(User)[index] = user;
			} else {
				this.typeMap.get(User).push(user)
			}
		}
	}

	// must give it an id...
	public save(item?: UserRole | Sprint | BacklogItem | User | Project | Release) {
		const typeOfItem = typeof item
		try {
			if (item instanceof User) {
				this.saveUser(item)
			} else if (!item) {
				// do nothing?
				console.log("item is not there")
			} else {
				if (!item.id) {
					item.id = this.typeNextIdMap.get(typeOfItem)
					this.typeNextIdMap.set(typeOfItem, this.typeNextIdMap.get(typeOfItem) + 1)
					this.typeMap.get(typeOfItem).push(item)
				} else {
					const index = this.typeMap.get(typeOfItem).findIndex(u => u.id === item.id);
					if (index !== -1) {
						this.typeMap.get(typeOfItem)[index] = item;
					} else {
						this.typeMap.get(typeOfItem).push(item)
					}
				}
			}
		return item
		} catch {
			throw new NotSavedError(`Failed to save ${item}`)
		}
	}

	// hopefully we wont need this method
	public find(entity: EntityTarget<ObjectLiteral>, findOptions: FindManyOptions<ObjectLiteral>) {
		throw new Error("find not implemented")
	}

	public deleteAll(): void {
		this.typeMap = new Map<any, any[]>([
			[User, []],
			[Project, []],
			[Release, []],
			[Sprint, []],
			[UserRole, []],
			[BacklogItem, []],
		])
		this.typeNextIdMap = new Map<any, number>([
			[User, 1],
			[Project, 1],
			[Release, 1],
			[Sprint, 1],
			[UserRole, 1],
			[BacklogItem, 1],
		])
	}
}
