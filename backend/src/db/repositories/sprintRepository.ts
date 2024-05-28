import { DeleteResult } from "typeorm";
import { Sprint } from "../../entity/sprint";
import { ModelRepository } from "./modelRepository";

export class SprintRepository extends ModelRepository {

	public async createNewSprint(releaseId: number, sprintNumber: number, startDate?: Date, endDate?: Date, goal?: string): Promise<Sprint> {
		const release = await this.releaseSource.lookupReleaseById(releaseId)
		const newSprint = new Sprint()
		newSprint.sprintNumber = sprintNumber
		newSprint.startDate = startDate ?? null
		newSprint.endDate = endDate ?? null
		newSprint.goal = goal ?? ""
		newSprint.release = release
		newSprint.backlogItemCount = 0
		newSprint.scrumMaster = null
		await this.sprintSource.save(newSprint)
		return newSprint
	}

	public async updateSprint(sprintId: number, sprintNumber?: number, startDate?: Date, endDate?: Date, goal?: string, scrumMasterId?: number): Promise<Sprint> {
		const sprint = await this.sprintSource.lookupSprintByIdWithScrumMaster(sprintId);
		sprint.sprintNumber = sprintNumber ?? sprint.sprintNumber
		sprint.startDate = startDate ?? sprint.startDate
		sprint.endDate = endDate ?? sprint.endDate
		sprint.goal = goal ?? sprint.goal

		if (scrumMasterId) {
			const newScrumMaster = await this.userSource.lookupUserById(scrumMasterId);
			sprint.scrumMaster = newScrumMaster;
		}

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

	public async getSprintsWithBacklog(releaseId: number): Promise<Sprint[]> {
		return await this.sprintSource.getSprintsWithBacklog(releaseId);
	}

	public async deleteSprint(id: number): Promise<DeleteResult> {
		return await this.sprintSource.deleteSprint(id);
	}

}