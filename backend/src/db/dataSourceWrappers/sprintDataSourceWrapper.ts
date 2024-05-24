import { DeletionError, NotFoundError } from "../../helpers/errors";
import { ModelDataSourceWrapper } from "./modelDataSourceWrapper";
import { Release } from "../../entity/release";
import { Sprint } from "../../entity/sprint";
import { BacklogItem } from "entity/backlogItem";
import { DeleteResult } from "typeorm";

export class SprintDataSourceWrapper extends ModelDataSourceWrapper {

	public async lookupSprintById(id: number): Promise<Sprint> {
		const maybeSprint = await this.dataSource.manager.findOneBy(Sprint, { id: id });
		if (!maybeSprint) {
			throw new NotFoundError(`Sprint with id ${id} not found`)
		}
		return maybeSprint
	}

	public async lookupSprintByIdWithRelease(id: number): Promise<Sprint> {
		const maybeSprint = await this.dataSource.getRepository(Sprint).find({
			where: { id: id },
			relations: {
				release: true // must sort by sprint.sprintNumber later
			},
		})
		if (!maybeSprint || maybeSprint.length === 0) {
			throw new NotFoundError(`Sprint with id ${id} not found`)
		}
		return maybeSprint[0]
	}

	public async lookupSprintByIdWithTodos(id: number): Promise<Sprint> {
		const maybeSprint = await this.dataSource.getRepository(Sprint).find({
			where: { id: id },
			relations: {
				todos: true // must sort by sprint.sprintNumber later
			},
		})
		if (!maybeSprint || maybeSprint.length === 0) {
			throw new NotFoundError(`Sprint with id ${id} not found`)
		}
		return maybeSprint[0]
	}

	public async getSprintsWithBacklog(releaseId: number): Promise<Sprint[]> {
		const sprints = await this.dataSource.getRepository(Sprint).find({
			relations: {
				release: true,
				todos: true,
			},
			where: {
				release: { id: releaseId }
			},
		})
		if (!sprints || sprints.length === 0) {
			throw new NotFoundError(`Release with releaseId ${releaseId} not found`)
		}
		return sprints;
	}

	public async getSprintsWithBacklogAndScrumMasters(releaseId: number): Promise<Sprint[]> {
		const sprints = await this.dataSource.getRepository(Sprint).find({
			relations: {
				release: true,
				todos: true,
				scrumMaster: true,
			},
			where: {
				release: { id: releaseId }
			},
		})
		if (!sprints || sprints.length === 0) {
			throw new NotFoundError(`Release with releaseId ${releaseId} not found`)
		}
		return sprints;
	}

	public async lookupSprintByIdWithScrumMaster(sprintId: number): Promise<Sprint> {
		const maybeSprint = await this.dataSource.getRepository(Sprint).find({
			where: { id: sprintId },
			relations: {
				scrumMaster: true
			},
		})
		if (!maybeSprint || maybeSprint.length === 0) {
			throw new NotFoundError(`Sprint with id ${sprintId} not found`)
		}
		return maybeSprint[0];
	}

	public async deleteSprint(sprintId: number): Promise<DeleteResult> {
		return await super.delete(Sprint, sprintId);
	}
}