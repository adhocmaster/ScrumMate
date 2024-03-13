import { Sprint } from "../../entity/sprint";
import { Release } from "../../entity/release";
import { DataSourceWrapper } from "../dataSourceWrapper";

export class ReleaseRepository {
	dataSource: DataSourceWrapper

	constructor (dataSource: DataSourceWrapper) {
		this.dataSource = dataSource
	}

	/// correctly automatically generates new revision if not provided
	public async createNewRelease(projectId: number, revision?: number, revisionDate?: Date, problemStatement?: string, goalStatement?: string): Promise<Release> {
		const project = await this.dataSource.lookupProjectById(projectId)
		const release = new Release()
		release.project = project 
		if (!revision) {
			revision = project.nextRevision
			project.nextRevision = project.nextRevision + 1
			await this.dataSource.save(project)
		}
		release.revision = revision
		release.revisionDate = revisionDate ?? new Date()
		release.problemStatement = problemStatement ?? ""
		release.goalStatement = goalStatement ?? ""
		await this.dataSource.save(release)
		return release
	}

	public async updateRelease(releaseId: number, revisionDate?: Date, problemStatement?: string, goalStatement?: string): Promise<Release> {
		const release = await this.dataSource.lookupReleaseById(releaseId)
		// const releaseWithProject = await this.dataSource.fetchReleaseWithProject(releaseId)
		// release.revision = revision ?? release.revision // shouldnt change
		release.revisionDate = revisionDate ?? release.revisionDate
		release.problemStatement = problemStatement ?? release.problemStatement
		release.goalStatement = goalStatement ?? release.goalStatement
		await this.dataSource.save(release)
		return release
	}

	/// Copies the columns only, but not the relations. TODO: copy relations
	public async copyRelease(releaseId: number): Promise<Release> {
		const releaseCopy = new Release();
		// need to get the whole list of releases in this project so we can get the new version #
		// should we just make a new variable to count the max version
		const releaseWithProject = await this.dataSource.fetchReleaseWithProject(releaseId)
		releaseCopy.copy(releaseWithProject)
		releaseCopy.revision = releaseCopy.project.nextRevision;
		releaseCopy.project.nextRevision += 1;
		await this.dataSource.save(releaseCopy.project)
		await this.dataSource.save(releaseCopy)
		return releaseCopy
	}

	/// return list sorted by ascending sprint number
	public async getReleaseSprints(releaseId: number): Promise<Sprint[]> {
		const sprints = await this.dataSource.getSprintWithBacklog(releaseId);
		return sprints.sort((a: Sprint, b: Sprint) => a.sprintNumber - b.sprintNumber)
	}

	/// return new order sorted by ascending sprint number
	public async reorderSprints(releaseId: number, startIndex: number, destinationIndex: number): Promise<Sprint[]> {
		const sprints = await this.dataSource.getSprintWithBacklog(releaseId)
		// unfortunately cant call getReleaseSprints() because we need the release too
		// otherwise we need to take a performance hit looking up the release again
		sprints.sort((a: Sprint, b: Sprint) => a.sprintNumber - b.sprintNumber)
		const [item] = sprints.splice(startIndex, 1)
		sprints.splice(destinationIndex, 0, item)
		for (const {sprint, index} of sprints.map((sprint, index) => ({sprint, index}))) {
			sprint.sprintNumber = index+1;
			await this.dataSource.save(sprint)
		}
		// await this.dataSource.save(sprints)
		return sprints;
	}

	/// return new list sorted by ascending sprint number
	public async removeSprintFromRelease(sprintId: number): Promise<Sprint[]> {
		const sprintWithRelease = await this.dataSource.lookupSprintByIdWithRelease(sprintId)
		await this.dataSource.moveSprintTodosToBacklog(sprintWithRelease.release.id, sprintId)
		await this.dataSource.deleteSprint(sprintId)
		const releaseWithSprints = await this.dataSource.fetchReleaseWithSprints(sprintWithRelease.release.id)
		for (const {sprint, index} of releaseWithSprints.sprints.map((sprint, index) => ({sprint, index}))) {
			sprint.sprintNumber = index+1;
			await this.dataSource.save(sprint)
		}
		await this.dataSource.save(releaseWithSprints)
		return releaseWithSprints.sprints;
	}

}