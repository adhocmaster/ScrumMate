import { DeletionError, NotFoundError } from "../../helpers/errors";
import { ModelDataSourceWrapper } from "./modelDataSourceWrapper";
import { Release } from "../../entity/release";
import { Sprint } from "../../entity/sprint";

export class SprintDataSourceWrapper extends ModelDataSourceWrapper {
	
	public async lookupSprintById(id: number): Promise<Sprint> {
		const maybeSprint =  await this.dataSource.manager.findOneBy(Sprint, {id: id});
		if (!maybeSprint) {
			throw new NotFoundError(`Sprint with id ${id} not found`)
		}
		return maybeSprint
	}
	
	public async lookupSprintByIdWithRelease(id: number): Promise<Sprint> {
		const maybeSprint = await this.dataSource.getRepository(Sprint).find({
			where: {id: id},
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
			where: {id: id},
			relations: {
				todos: true // must sort by sprint.sprintNumber later
			},
		})
		if (!maybeSprint || maybeSprint.length === 0) {
			throw new NotFoundError(`Sprint with id ${id} not found`)
		}
		return maybeSprint[0]
	}
	
	public async moveSprintTodosToBacklog(releaseId: number, sprintId: number): Promise<void> {
		const maybeSprintWithTodos = await this.lookupSprintByIdWithTodos(sprintId);
		const maybeRelease = await this.dataSource.getRepository(Release).find({
			where: {id: releaseId},
			relations: {
				sprints: true,
				backlog: true
			}
		})
		if (!maybeRelease || maybeRelease.length === 0) {
			throw new NotFoundError(`Release with id ${releaseId} not found`)
		}
		maybeRelease[0].backlog = [...maybeSprintWithTodos.todos, ...maybeRelease[0].backlog]
		await this.save(maybeRelease)
		maybeSprintWithTodos.todos = []
		await this.save(maybeSprintWithTodos)
	}
	
	public async getSprintWithBacklog(releaseId: number): Promise<Sprint[]> {
		const sprints = await this.dataSource.getRepository(Sprint).find({
			relations:{
				release: true,
				todos: true,
			},
			where: {
				release: {id: releaseId}
			},
		})
		if (!sprints || sprints.length === 0) {
			throw new NotFoundError(`Release with releaseId ${releaseId} not found`)
		}
		return sprints;
	}
	
	// TODO: handle stories in the sprint
	// Maybe we can make it soft-delete if we ever implement undo feature
	public async deleteSprint(id: number): Promise<void> {
		try {
			await this.dataSource.getRepository(Sprint).delete(id)
		} catch (e) {
			console.log(e)
			throw new DeletionError(`Sprint with id ${id} failed to delete`)
		}
	}
}