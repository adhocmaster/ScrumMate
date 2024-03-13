import { Project } from "../../entity/project";
import { Release } from "../../entity/release";
import { NotFoundError } from "../../helpers/errors";
import { reverse } from "lodash";
import { ModelDataSourceWrapper } from "./modelDataSourceWrapper";

export class ProjectDataSourceWrapper extends ModelDataSourceWrapper {

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
}