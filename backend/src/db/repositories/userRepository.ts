import { User } from "../../entity/User";
import { Project } from "../../entity/project";
import { authentication, random } from "../../helpers";
import { ExistingUserError, NotFoundError } from "../../helpers/errors";
import { ModelRepository } from "./modelRepository";

export class UserRepository extends ModelRepository {

	public async createNewUser(username: string, email: string, password: string, salt?: string, sessionToken?: string): Promise<User> {
		const newUser = new User()
		newUser.username = username
		newUser.email = email
		newUser.salt = salt ?? random();
		newUser.password = authentication(newUser.salt, password);
		try {
			await this.userSource.save(newUser)
		} catch {
			throw new ExistingUserError("Likely found a duplicate username or email")
		}
		delete newUser.password;
		return newUser
	}

	public async updateUser(id: number, username?: string, email?: string, password?: string, salt?: string, sessionToken?: string): Promise<User> {
		const user = await this.userSource.lookupUserById(id)
		user.username = username ?? user.username
		user.email = email ?? user.email
		user.password = password ?? user.password
		user.salt = salt ?? user.salt
		user.sessionToken = sessionToken ?? user.sessionToken
		await this.userSource.save(user)
		return user
	}

	public async forceJoinProject(userId: number, projectId: number): Promise<Project> {
		const user = await this.userSource.lookupUserById(userId)
		const project = await this.projectSource.lookupProjectById(projectId)
		user.addJoinedProject(project)
		project.addTeamMember(user)
		await this.userSource.save(user)
		await this.projectSource.save(project)

		// make the most recent fully signed revision (if there is one) no longer fully signed
		const projectWithReleases = await this.projectSource.fetchProjectWithReleases(projectId);
		for (const release of projectWithReleases.releases) {
			if (release.fullySigned) {
				release.fullySigned = false
				await this.releaseSource.save(release)
				break
			}
		}

		return project
	}

	public async lookupUserById(id: number) {
		return await this.userSource.lookupUserById(id);
	}

	public async lookupUserByEmail(email: string) {
		return await this.userSource.lookupUserByEmail(email);
	}

	public async lookupUserBySessionToken(sessionToken: string) {
		return await this.userSource.lookupUserBySessionToken(sessionToken);
	}

	public async fetchUserWithProjects(id: number) {
		return await this.userSource.fetchUserWithProjects(id);
	}

	public async fetchUserWithProjectInvites(id: number) {
		return await this.userSource.fetchUserWithProjectInvites(id);
	}

	public async acceptInvite(userId: number, projectId: number) {
		const userWithInvites = await this.fetchUserWithProjectInvites(userId);
		const userWithProjects = await this.fetchUserWithProjects(userId);
		const project = await this.projectSource.lookupProjectByIdWithUsers(projectId);

		if (!userWithInvites.projectInvites.some(project => project.id === projectId)) {
			throw new NotFoundError(`Invite to project with id ${projectId} not found`)
		}

		userWithProjects.projectInvites = userWithInvites.projectInvites.filter(projectInvite => projectInvite.id !== projectId)
		project.invitedUsers = project.invitedUsers.filter(invitedUser => invitedUser.id !== userId);
		project.teamMembers.push(userWithProjects);
		userWithProjects.joinedProjects.push(project)

		await this.projectSource.save(project);
		await this.userSource.save(userWithProjects);

		project.teamMembers = undefined

		// make the most recent fully signed revision (if there is one) no longer fully signed
		const projectWithReleases = await this.projectSource.fetchProjectWithReleases(projectId);
		for (const release of projectWithReleases.releases) {
			if (release.fullySigned) {
				release.fullySigned = false
				await this.releaseSource.save(release)
				break
			}
		}

		return [userWithProjects, project];
	}

	public async rejectInvite(userId: number, projectId: number) {
		const userWithInvites = await this.fetchUserWithProjectInvites(userId);
		const project = await this.projectSource.lookupProjectByIdWithUsers(projectId);

		if (!userWithInvites.projectInvites.some(project => project.id === projectId)) {
			throw new NotFoundError(`Invite to project with id ${projectId} not found`)
		}

		userWithInvites.projectInvites = userWithInvites.projectInvites.filter(projectInvite => projectInvite.id !== projectId)
		project.invitedUsers = project.invitedUsers.filter(invitedUser => invitedUser.id !== userId);

		await this.projectSource.save(project);
		await this.userSource.save(userWithInvites);

		return userWithInvites;
	}

	public async fetchUserProjectsRowData(userId: number) {
		const userWithProjects = await this.fetchUserWithProjects(userId);
		const projectList = userWithProjects.ownedProjects.concat(userWithProjects.joinedProjects);
		const projectDataList = [];

		for (const project of projectList) {
			const projectData = await this.projectSource.lookupProjectByIdWithOwnerAndRelease(project.id);
			// TODO: if there is a release plan:
			//		find the current sprint number of the most recent (signed) release plan's sprint
			//		set projectWithOwnerAndRelease.currentSprint to it
			// else: set projectWithOwnerAndRelease.numRevisions = "-" so that is displayed
			// if (projectWithOwnerAndRelease.numRevisions > 0) {
			// }
			projectDataList.push(projectData);
		}

		return projectDataList;
	}

}