import { NotFoundError } from "../../helpers/errors";
import { ModelDataSourceWrapper } from "./modelDataSourceWrapper";
import { Sprint } from "../../entity/sprint";
import { DeleteResult } from "typeorm";

export class SprintDataSourceWrapper extends ModelDataSourceWrapper {

	public async lookupSprintById(id: number): Promise<Sprint> {
		const maybeSprint = await this.dataSource.manager.findOneBy(Sprint, { id: id });
		if (!maybeSprint) {
			throw new NotFoundError(`Sprint with id ${id} not found`)
		}
		return maybeSprint
	}

	public async lookupSprintByIdWithRelations(
		sprintId: number,
		includedRelations: {
			includeScrumMaster?: boolean,
			includeRelease?: boolean,
			includeTodos?: boolean,
			includeRoles?: boolean,
		}
	): Promise<Sprint> {
		const sprint = await this.dataSource.getRepository(Sprint).find({
			where: { id: sprintId },
			relations: {
				scrumMaster: includedRelations.includeScrumMaster,
				release: includedRelations.includeRelease,
				todos: includedRelations.includeTodos,
				roles: includedRelations.includeRoles,
			},
		});
		if (!sprint || sprint.length === 0) {
			throw new NotFoundError(`Sprint with sprintId ${sprintId} not found`);
		}
		return sprint[0];
	}

	public async lookupSprintByIdWithRelease(sprintId: number): Promise<Sprint> {
		const relations = {
			includeRelease: true,
		};
		return await this.lookupSprintByIdWithRelations(sprintId, relations);
	}

	public async lookupSprintByIdWithTodos(sprintId: number): Promise<Sprint> {
		const relations = {
			includeTodos: true,
		};
		const sprint = await this.lookupSprintByIdWithRelations(sprintId, relations);
		sprint.sortTODO();
		return sprint;
	}

	public async lookupSprintByIdWithScrumMaster(sprintId: number): Promise<Sprint> {
		const relations = {
			includeScrumMaster: true,
		};
		return await this.lookupSprintByIdWithRelations(sprintId, relations);
	}

	public async getSprintsWithBacklog(releaseId: number): Promise<Sprint[]> {
		const sprints = await this.dataSource.getRepository(Sprint).find({
			where: {
				release: { id: releaseId }
			},
			relations: {
				release: true,
				todos: true,
			},
		})
		if (!sprints || sprints.length === 0) {
			throw new NotFoundError(`Release with releaseId ${releaseId} not found`)
		}
		return sprints;
	}

	public async getSprintsWithBacklogAndScrumMasters(releaseId: number): Promise<Sprint[]> {
		const sprints = await this.dataSource.getRepository(Sprint).find({
			where: {
				release: { id: releaseId }
			},
			relations: {
				release: true,
				todos: true,
				scrumMaster: true,
			},
		})
		if (!sprints || sprints.length === 0) {
			throw new NotFoundError(`Release with releaseId ${releaseId} not found`)
		}
		return sprints;
	}

	public async deleteSprint(sprintId: number): Promise<DeleteResult> {
		return await super.delete(Sprint, sprintId);
	}
}