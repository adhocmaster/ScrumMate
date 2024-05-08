import { User } from "../../entity/User";
import { Release } from "../../entity/release";
import { Project } from "../../entity/project";
import { ModelRepository } from "./modelRepository";
import { ExistingUserError } from "../../helpers/errors";

export class ProjectRepository extends ModelRepository {

	public async createNewProject(userId: number, projectName: string): Promise<Project> {
		const user = await this.userSource.lookupUserById(userId)
		const newProject = new Project()
		newProject.name = projectName
		newProject.numRevisions = 1
		newProject.productOwner = user
		const defaultRelease = new Release()
		defaultRelease.revision = 1
		defaultRelease.revisionDate = new Date()
		defaultRelease.problemStatement = ""
		defaultRelease.goalStatement = ""
		defaultRelease.backlogItemCount = 0
		defaultRelease.project = newProject
		newProject.releases = [defaultRelease];
		await this.projectSource.save(newProject)
		await this.releaseSource.save(defaultRelease)
		newProject.releases[0].project = undefined;
		return newProject
	}

	public async updateProject(id: number, name?: string): Promise<Project> {
		const project = await this.projectSource.lookupProjectByIdWithOwnerAndRelease(id)
		project.name = name ?? project.name
		await this.projectSource.save(project)
		return project
	}

	public async leaveProject(userId: number, projectId: number): Promise<void> {
		function getNewProductOwner(userList: User[]) {
			return userList[userList.length * Math.random() | 0];
		}

		const user = await this.userSource.fetchUserWithProjects(userId);
		const project = await this.projectSource.lookupProjectByIdWithUsers(projectId);
		if (project.productOwner.id === userId) {
			user.ownedProjects = user.ownedProjects.filter((proj) => { return proj.id !== projectId })
			if (project.teamMembers.length > 0) {
				const newProductOwner = getNewProductOwner(project.teamMembers);
				project.teamMembers = project.teamMembers.filter((user) => { return user.id !== newProductOwner.id });
				project.productOwner = newProductOwner;
			} else {
				await this.deleteProject(projectId);
				await this.userSource.save(user);
				return;
			}
		} else {
			project.teamMembers = project.teamMembers.filter((user) => { return user.id !== userId });
			user.joinedProjects = user.joinedProjects.filter((proj) => { return proj.id !== projectId })
		}
		await this.userSource.save(user);
		await this.projectSource.save(project);

		// check every revision that is not signed yet and make it fully signed if this was the missing signature
		const projectWithReleases = await this.projectSource.fetchProjectWithReleases(projectId);
		for (const release of projectWithReleases.releases) {
			if (!release.fullySigned && release.signatures.length === project.teamMembers.length) {
				release.fullySigned = true;
				await this.releaseSource.save(release)
			}
		}
	}

	public async deleteBacklogItem(backlogItemId: number) {
		// const backlogItem = this.backlogSource.lookupBacklogById(backlogItemId);
		// TODO: delete assignees
		await this.backlogSource.deleteBacklogItem(backlogItemId);
	}

	public async deleteSprint(sprintId: number) {
		const sprintToDelete = await this.sprintSource.lookupSprintByIdWithTodos(sprintId);
		for (const backlogItem of sprintToDelete.todos) {
			await this.deleteBacklogItem(backlogItem.id)
		}
		// TODO: delete sprint roles
		await this.sprintSource.deleteSprint(sprintId);
	}

	public async deleteReleases(releaseId: number) {
		const releaseToDelete = await this.releaseSource.fetchReleaseWithEverything(releaseId);
		for (const sprint of releaseToDelete.sprints) {
			await this.deleteSprint(sprint.id);
		}
		for (const backlogItem of releaseToDelete.backlog) {
			await this.deleteBacklogItem(backlogItem.id);
		}
		for (const backlogItem of releaseToDelete.deletedBacklog) {
			await this.deleteBacklogItem(backlogItem.id);
		}
		await this.releaseSource.deleteRelease(releaseId);
	}

	public async deleteProject(projectId: number) {
		const projectToDelete = await this.projectSource.fetchProjectWithReleases(projectId);
		for (const release of projectToDelete.releases) {
			await this.deleteReleases(release.id)
		}
		// TODO: delete userroles as well
		await this.projectSource.deleteProject(projectId)
	}

	public async lookupProjectById(id: number): Promise<Project> {
		return await this.projectSource.lookupProjectById(id);
	}

	public async lookupProjectByIdWithUsers(id: number): Promise<Project> {
		return await this.projectSource.lookupProjectByIdWithUsers(id);
	}

	public async lookupProjectMembers(id: number): Promise<(User | User[])[]> {
		const project = await this.projectSource.lookupProjectByIdWithUsers(id);
		return [project.invitedUsers, project.productOwner, project.teamMembers]
	}

	public async removeProjectMember(projectId: number, memberId: number): Promise<(User | User[])[]> {
		const project = await this.projectSource.lookupProjectByIdWithUsers(projectId);
		project.teamMembers = project.teamMembers.filter(member => member.id !== memberId);
		await this.projectSource.save(project);
		return [project.invitedUsers, project.productOwner, project.teamMembers]
	}

	public async inviteUser(projectId: number, userEmail: string): Promise<(User | User[])[]> {
		const project = await this.projectSource.lookupProjectByIdWithUsers(projectId);
		const userToInvite = await this.userSource.fetchUserByEmailWithProjectInvites(userEmail);

		if (project.productOwner.email === userEmail || project.teamMembers.some(member => member.email === userEmail) || project.invitedUsers.some(member => member.email === userEmail)) {
			throw new ExistingUserError(`User with email ${userEmail} is already on the tean`);
		}

		project.invitedUsers.push(userToInvite);
		userToInvite.projectInvites.push(project);

		await this.projectSource.save(project);
		await this.userSource.save(userToInvite);

		userToInvite.projectInvites = undefined;

		return [project.invitedUsers, project.productOwner, project.teamMembers]
	}

	public async cancelInvite(projectId: number, userId: number): Promise<(User | User[])[]> {
		const project = await this.projectSource.lookupProjectByIdWithUsers(projectId);
		const userToInvite = await this.userSource.fetchUserWithProjectInvites(userId);

		userToInvite.projectInvites = userToInvite.projectInvites.filter(project => project.id !== projectId);
		project.invitedUsers = project.invitedUsers.filter(user => user.id !== userId);

		await this.projectSource.save(project);
		await this.userSource.save(userToInvite);

		return [project.invitedUsers, project.productOwner, project.teamMembers]
	}

	public async fetchProjectWithReleases(id: number): Promise<Project> {
		return await this.projectSource.fetchProjectWithReleases(id);
	}

	public async fetchMostRecentRelease(id: number): Promise<Release> {
		return await this.projectSource.fetchMostRecentRelease(id);
	}

}