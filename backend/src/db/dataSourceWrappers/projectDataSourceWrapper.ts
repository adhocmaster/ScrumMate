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
			includeReleases?: boolean,
			includeRoles?: boolean,
		}
	): Promise<Project> {
		const backlogItemWithPoker = await this.dataSource.getRepository(Project).find({
			where: { id: projectId },
			relations: {
				productOwner: includedRelations.includeProductOwner,
				teamMembers: includedRelations.includeTeamMembers,
				invitedUsers: includedRelations.includeInvitedUsers,
				releases: includedRelations.includeReleases,
				roles: includedRelations.includeRoles,
			},
		});
		if (!backlogItemWithPoker || backlogItemWithPoker.length === 0) {
			throw new NotFoundError(`Project with projectId ${projectId} not found`);
		}
		return backlogItemWithPoker[0];
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
		const maybeProject = await this.dataSource.getRepository(Project).find({
			where: { id: id },
			relations: {
				releases: {
					signatures: true
				},
			}
		});
		if (!maybeProject || maybeProject.length === 0) {
			throw new NotFoundError(`Project with id ${id} not found`);
		}
		return maybeProject[0];
	}

	public async fetchMostRecentRelease(id: number): Promise<Release> {
		return (await this.fetchProjectWithReleases(id)).sortReleases()[0];
	}

	public async deleteProject(projectId: number) {
		return await super.delete(Project, projectId);
	}
}