import { Project } from "../../entity/project";
import { Release } from "../../entity/release";
import { NotFoundError } from "../../helpers/errors";
import { ModelDataSourceWrapper } from "./modelDataSourceWrapper";

export class ProjectDataSourceWrapper extends ModelDataSourceWrapper {

	public async lookupProjectById(id: number): Promise<Project> {
		const maybeProject = await this.dataSource.manager.findOneBy(Project, { id: id });
		if (!maybeProject) {
			throw new NotFoundError(`Project with id ${id} not found`)
		}
		return maybeProject
	}

	public async lookupProjectByIdWithRelations(
		projectId: number,
		includedRelations: {
			includeProductOwner?: boolean,
			includeTeamMembers?: boolean,
			includeInvitedUsers?: boolean,
			includeReleases?: boolean | { signatures: boolean },
			includeRoles?: boolean,
		}
	): Promise<Project> {
		const project = await this.dataSource.getRepository(Project).find({
			where: { id: projectId },
			relations: {
				productOwner: includedRelations.includeProductOwner,
				teamMembers: includedRelations.includeTeamMembers,
				invitedUsers: includedRelations.includeInvitedUsers,
				releases: includedRelations.includeReleases,
				roles: includedRelations.includeRoles,
			},
		});
		if (!project || project.length === 0) {
			throw new NotFoundError(`Project with projectId ${projectId} not found`);
		}
		return project[0];
	}

	public async lookupProjectByIdWithUsers(id: number): Promise<Project> {
		const relations = {
			includeProductOwner: true,
			includeTeamMembers: true,
			includeInvitedUsers: true,
		};
		return await this.lookupProjectByIdWithRelations(id, relations);
	}

	public async lookupProjectByIdWithOwnerAndRelease(id: number): Promise<Project> {
		const relations = {
			includeProductOwner: true,
			includeReleases: true,
		};
		return await this.lookupProjectByIdWithRelations(id, relations);
	}

	public async fetchProjectWithReleases(id: number): Promise<Project> {
		const relations = {
			includeReleases: { signatures: true }
		};
		const project = await this.lookupProjectByIdWithRelations(id, relations);
		project.sortReleases();
		return project;
	}

	public async fetchMostRecentRelease(id: number): Promise<Release> {
		return (await this.fetchProjectWithReleases(id)).releases[0];
	}

	public async deleteProject(projectId: number) {
		return await super.delete(Project, projectId);
	}
}