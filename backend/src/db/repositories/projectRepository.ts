import { Release } from "../../entity/release";
import { Project } from "../../entity/project";
import { ModelRepository } from "./modelRepository";

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

	public async updateProject(id: number, name?: string,): Promise<Project> {
		const project = await this.projectSource.lookupProjectByIdWithOwnerAndRelease(id)
		project.name = name ?? project.name
		await this.projectSource.save(project)
		return project
	}

	public async lookupProjectById(id: number): Promise<Project> {
		return await this.projectSource.lookupProjectById(id);
	}

	public async lookupProjectByIdWithUsers(id: number): Promise<Project> {
		return await this.projectSource.lookupProjectByIdWithUsers(id);
	}

	public async fetchProjectWithReleases(id: number): Promise<Project> {
		return await this.projectSource.fetchProjectWithReleases(id);
	}

	public async fetchMostRecentRelease(id: number): Promise<Release> {
		return await this.projectSource.fetchMostRecentRelease(id);
	}

}