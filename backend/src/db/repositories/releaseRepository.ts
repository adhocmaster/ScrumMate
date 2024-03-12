import { Sprint } from "../../entity/sprint";
import { Release } from "../../entity/release";
import { ModelRepository } from "./modelRepository";
import { BacklogItem, Story } from "../../entity/backlogItem";

export class ReleaseRepository extends ModelRepository {

	/// correctly automatically generates new revision if not provided
	public async createNewRelease(projectId: number, revision?: number, revisionDate?: Date, problemStatement?: string, goalStatement?: string): Promise<Release> {
		const project = await this.projectSource.lookupProjectById(projectId)
		const release = new Release()
		release.project = project 
		if (!revision) {
			revision = project.nextRevision
			project.nextRevision = project.nextRevision + 1
			await this.projectSource.save(project)
		}
		release.revision = revision
		release.revisionDate = revisionDate ?? new Date()
		release.problemStatement = problemStatement ?? ""
		release.goalStatement = goalStatement ?? ""
		await this.releaseSource.save(release)
		return release
	}

	public async updateRelease(releaseId: number, revisionDate?: Date, problemStatement?: string, goalStatement?: string): Promise<Release> {
		const release = await this.releaseSource.lookupReleaseById(releaseId)
		// const releaseWithProject = await this.dataSource.fetchReleaseWithProject(releaseId)
		// release.revision = revision ?? release.revision // shouldnt change
		release.revisionDate = revisionDate ?? release.revisionDate
		release.problemStatement = problemStatement ?? release.problemStatement
		release.goalStatement = goalStatement ?? release.goalStatement
		await this.releaseSource.save(release)
		return release
	}

	public async copyRelease(releaseId: number): Promise<Release> {
		const releaseCopy = new Release();
		const releaseWithEverything = await this.releaseSource.fetchReleaseWithEverything(releaseId);
		// copy the sprint columns
		releaseCopy.copy(releaseWithEverything);

		// set the new revision number
		releaseCopy.revision = releaseWithEverything.project.nextRevision;
		releaseWithEverything.project.nextRevision += 1;
		await this.projectSource.save(releaseWithEverything.project);
		await this.releaseSource.save(releaseCopy)

		// copy the sprints
		for (const sprint of releaseWithEverything.getSprints()) {
			const sprintCopy = new Sprint();
			sprintCopy.release = releaseCopy;

			// copy the columns
			sprintCopy.copy(sprint);
			await this.sprintSource.save(sprintCopy); 
			sprintCopy.release = undefined;

			// copy the stories
			for (const backlogItem of sprint.getTODOs()) {
				if (backlogItem instanceof Story) {
					const storyCopy = new Story();
					storyCopy.copy(backlogItem);
					storyCopy.sprint = sprintCopy;
					await this.backlogSource.save(storyCopy);
					storyCopy.sprint = undefined;
					sprintCopy.addTODO(storyCopy);
			} else if (backlogItem instanceof BacklogItem) {
					const backlogItemCopy = new BacklogItem();
					backlogItemCopy.copy(backlogItem);
					backlogItemCopy.sprint = sprintCopy;
					await this.backlogSource.save(backlogItemCopy);
					backlogItemCopy.sprint = undefined;
					sprintCopy.addTODO(backlogItemCopy);
				}
			}
			
			releaseCopy.addSprint(sprintCopy);
		}

		// copy the backlog
		for (const backlogItem of releaseWithEverything.getBacklog()) {
			if (backlogItem instanceof Story) {
				const storyCopy = new Story();
				storyCopy.copy(backlogItem);
				storyCopy.release = releaseCopy;
				await this.backlogSource.save(storyCopy);
				storyCopy.release = undefined;
				releaseCopy.addToBacklog(storyCopy);
			} else if (backlogItem instanceof BacklogItem) {
				const backlogItemCopy = new BacklogItem();
				backlogItemCopy.copy(backlogItem);
				backlogItemCopy.release = releaseCopy;
				await this.backlogSource.save(backlogItemCopy);
				backlogItemCopy.release = undefined;
				releaseCopy.addToBacklog(backlogItemCopy);
			}
		}

		return releaseCopy
	}

	/// return list sorted by ascending sprint number
	public async getReleaseSprints(releaseId: number): Promise<Sprint[]> {
		const sprints = await this.sprintSource.getSprintWithBacklog(releaseId);
		return sprints.sort((a: Sprint, b: Sprint) => a.sprintNumber - b.sprintNumber)
	}

	/// return new order sorted by ascending sprint number
	public async reorderSprints(releaseId: number, startIndex: number, destinationIndex: number): Promise<Sprint[]> {
		const sprints = await this.sprintSource.getSprintWithBacklog(releaseId)
		// unfortunately cant call getReleaseSprints() because we need the release too
		// otherwise we need to take a performance hit looking up the release again
		sprints.sort((a: Sprint, b: Sprint) => a.sprintNumber - b.sprintNumber)
		const [item] = sprints.splice(startIndex, 1)
		sprints.splice(destinationIndex, 0, item)
		for (const {sprint, index} of sprints.map((sprint, index) => ({sprint, index}))) {
			sprint.sprintNumber = index+1;
			await this.sprintSource.save(sprint)
		}
		// await this.dataSource.save(sprints)
		return sprints;
	}

	/// return new list sorted by ascending sprint number
	public async removeSprintFromRelease(sprintId: number): Promise<Sprint[]> {
		const sprintWithRelease = await this.sprintSource.lookupSprintByIdWithRelease(sprintId)
		await this.sprintSource.moveSprintTodosToBacklog(sprintWithRelease.release.id, sprintId)
		await this.sprintSource.deleteSprint(sprintId)
		const releaseWithSprints = await this.releaseSource.fetchReleaseWithSprints(sprintWithRelease.release.id)
		for (const {sprint, index} of releaseWithSprints.sprints.map((sprint, index) => ({sprint, index}))) {
			sprint.sprintNumber = index+1;
			await this.sprintSource.save(sprint)
		}
		await this.releaseSource.save(releaseWithSprints)
		return releaseWithSprints.sprints;
	}

	public async lookupReleaseById(id: number): Promise<Release> {
		return await this.releaseSource.lookupReleaseById(id);
	}

	public async fetchReleaseWithProject(releaseId: number): Promise<Release> {
		return await this.releaseSource.fetchReleaseWithProject(releaseId);
	}

	public async fetchReleaseWithSprints(releaseId: number): Promise<Release> {
		return await this.releaseSource.fetchReleaseWithSprints(releaseId);
	}

	public async fetchReleaseWithBacklog(releaseId: number): Promise<Release> {
		return await this.releaseSource.fetchReleaseWithBacklog(releaseId);
	}


}