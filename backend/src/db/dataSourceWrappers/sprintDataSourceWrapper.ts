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

	public async getSprintBacklog(sprintId: number): Promise<BacklogItem[]> {
		const maybeSprint = await this.dataSource.getRepository(Sprint).find({
			where: { id: sprintId },
			relations: {
				todos: true
			},
		})
		if (!maybeSprint || maybeSprint.length === 0) {
			throw new NotFoundError(`Sprint with id ${sprintId} not found`)
		}
		return maybeSprint[0].todos
	}

	// public async deleteSprint(id: number): Promise<void> {
	// 	try {
	// 		await this.dataSource.getRepository(Sprint).delete(id)
	// 	} catch (e) {
	// 		console.log(e)
	// 		throw new DeletionError(`Sprint with id ${id} failed to delete`)
	// 	}
	// }

	public async deleteSprint(sprintId: number): Promise<DeleteResult> {
		return await super.delete(Sprint, sprintId);
	}
}