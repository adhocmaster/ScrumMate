import { Project } from "../../entity/project";
import { DataSourceWrapper } from "../dataSourceWrapper";

export class ProjectRepository {
	dataSource: DataSourceWrapper

	constructor (dataSource: DataSourceWrapper) {
		this.dataSource = dataSource
	}

	public async createNewProject(userId: number, projectName: string): Promise<Project> {
		const user = await this.dataSource.lookupUserById(userId)
		const newProject = new Project()
		newProject.name = projectName
		newProject.nextRevision = 1
		newProject.productOwner = user
    	newProject.releases = [];
		await this.dataSource.save(newProject)
		return newProject
	}

	public async updateProject(id: number, name?: string,): Promise<Project> {
		const project = await this.dataSource.lookupProjectById(id)
		project.name = name ?? project.name
		await this.dataSource.save(project)
		return project
	}

}