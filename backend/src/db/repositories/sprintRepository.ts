import { Sprint } from "../../entity/sprint";
import { ModelRepository } from "./modelRepository";

export class SprintRepository extends ModelRepository {

	public async createNewSprint(releaseId: number, sprintNumber: number, startDate: Date, endDate: Date, goal: string): Promise<Sprint> {
		const release = await this.releaseSource.lookupReleaseById(releaseId)
		const newSprint = new Sprint()
		newSprint.sprintNumber = sprintNumber
		newSprint.startDate = startDate
		newSprint.endDate = endDate
		newSprint.goal = goal
		newSprint.release = release
		await this.sprintSource.save(newSprint)
		return newSprint
	}

	public async updateSprint(sprintId: number, sprintNumber?: number, startDate?: Date, endDate?: Date, goal?: string): Promise<Sprint> {
		const sprint = await this.sprintSource.lookupSprintById(sprintId)
		sprint.sprintNumber = sprintNumber ?? sprint.sprintNumber
		sprint.startDate = startDate ?? sprint.startDate
		sprint.endDate = endDate ?? sprint.endDate
		sprint.goal = goal ?? sprint.goal
		await this.sprintSource.save(sprint)
		return sprint
	}

	public async lookupSprintById(id: number): Promise<Sprint> {
		return await this.sprintSource.lookupSprintById(id);
	}

	public async lookupSprintByIdWithRelease(id: number): Promise<Sprint> {
		return await this.sprintSource.lookupSprintByIdWithRelease(id);
	}

	public async lookupSprintByIdWithTodos(id: number): Promise<Sprint> {
		return await this.sprintSource.lookupSprintByIdWithTodos(id);
	}

	public async moveSprintTodosToBacklog(releaseId: number, sprintId: number): Promise<void> {
		return await this.sprintSource.moveSprintTodosToBacklog(releaseId, sprintId);
	}

	public async getSprintWithBacklog(releaseId: number): Promise<Sprint[]> {
		return await this.sprintSource.getSprintWithBacklog(releaseId);
	}

	public async deleteSprint(id: number): Promise<void> {
		return await this.sprintSource.deleteSprint(id);
	}

}