import { Release } from "../../entity/release";
import { Project } from "../../entity/project";
import { ModelRepository } from "./modelRepository";

export class ProjectRepository extends ModelRepository {

	public async createNewProject(userId: number, projectName: string): Promise<Project> {
		const user = await this.userSource.lookupUserById(userId)
		const newProject = new Project()
		newProject.name = projectName
		newProject.nextRevision = 1
		newProject.productOwner = user
		newProject.releases = [];
		await this.projectSource.save(newProject)
		return newProject
	}

	public async updateProject(id: number, name?: string,): Promise<Project> {
		const project = await this.projectSource.lookupProjectById(id)
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

	public async fetchProjectData(id: number): Promise<Project> {
		const projectWithOwnerAndRelease = await this.projectSource.lookupProjectByIdWithOwnerAndRelease(id);
		projectWithOwnerAndRelease.nextRevision = projectWithOwnerAndRelease.nextRevision - 1;
		projectWithOwnerAndRelease.productOwner = projectWithOwnerAndRelease.productOwner;
		// TODO: if there is a release plan:
		//		find the current sprint number of the most recent (signed) release plan's sprint
		//		set projectWithOwnerAndRelease.currentSprint to it
		// else: set projectWithOwnerAndRelease.nextRevision = "-" so that is displayed
		// if (projectWithOwnerAndRelease.nextRevision > 0) {
		// }
		return projectWithOwnerAndRelease;
	}

	public async fetchProjectWithReleases(id: number): Promise<Project> {
		return await this.projectSource.fetchProjectWithReleases(id);
	}

	public async fetchMostRecentRelease(id: number): Promise<Release> {
		return await this.projectSource.fetchMostRecentRelease(id);
	}

}