import { Sprint } from "../../entity/sprint";
import { Release } from "../../entity/release";
import { ModelRepository } from "./modelRepository";
import { Epic, Story, Task, ActionItem, BacklogItem } from "../../entity/backlogItem";
import { User } from "../../entity/User";
// import { SigningError } from "../../helpers/errors";

export class ReleaseRepository extends ModelRepository {

	/// correctly automatically generates new revision if not provided
	public async createNewRelease(projectId: number, revision?: number, revisionDate?: Date, problemStatement?: string, goalStatement?: string): Promise<Release> {
		const project = await this.projectSource.lookupProjectById(projectId)
		const release = new Release()
		release.project = project
		if (!revision) {
			revision = project.numRevisions + 1
			project.numRevisions = project.numRevisions + 1
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

	private async copyBacklogItems(sourceList: BacklogItem[], func: (arg0: BacklogItem) => any) {
		const nameToConstructor = new Map<String, any>([
			["Epic", Epic],
			["Story", Story],
			["Task", Task],
			["ActionItem", ActionItem],
			["BacklogItem", BacklogItem],
		])
		for (const backlogItem of sourceList) {
			const backlogType = nameToConstructor.get(backlogItem.name);
			const copy = new backlogType();
			copy.copy(backlogItem);
			await func(copy);
		}
	}

	private async copyReleaseBacklog(releaseCopy: Release, sourceList: BacklogItem[]) {
		await this.copyBacklogItems(sourceList, async (backlogItemCopy) => {
			backlogItemCopy.release = releaseCopy;
			await this.backlogSource.save(backlogItemCopy);
			backlogItemCopy.release = undefined;
			releaseCopy.addToBacklog(backlogItemCopy);
		});
	}

	private async copyReleaseDeletedStories(releaseCopy: Release, sourceList: BacklogItem[]) {
		await this.copyBacklogItems(sourceList, async (backlogItemCopy) => {
			backlogItemCopy.deletedFrom = releaseCopy;
			await this.backlogSource.save(backlogItemCopy);
			backlogItemCopy.deletedFrom = undefined;
			releaseCopy.addToDeletedBacklogItems(backlogItemCopy);
		});
	}

	private async copySprintTodos(sprintCopy: Sprint, sourceList: BacklogItem[]) {
		await this.copyBacklogItems(sourceList, async (backlogItemCopy) => {
			backlogItemCopy.sprint = sprintCopy;
			await this.backlogSource.save(backlogItemCopy);
			backlogItemCopy.sprint = undefined;
			sprintCopy.addTODO(backlogItemCopy);
		});
	}

	private async copySprints(releaseCopy: Release, sourceList: Sprint[]): Promise<void> {
		for (const sprint of sourceList) {
			const sprintCopy = new Sprint();
			sprintCopy.release = releaseCopy;

			// copy the columns
			sprintCopy.copy(sprint);
			await this.sprintSource.save(sprintCopy);
			sprintCopy.release = undefined;

			await this.copySprintTodos(sprintCopy, sprint.getTODOs());
			releaseCopy.addSprint(sprintCopy);
		}
	}

	public async copyRelease(releaseId: number): Promise<Release> {
		const releaseCopy = new Release();
		const releaseWithEverything = await this.releaseSource.fetchReleaseWithEverything(releaseId);
		// copy the sprint columns
		releaseCopy.copy(releaseWithEverything);

		// set the new revision number
		releaseCopy.revision = releaseWithEverything.project.numRevisions + 1;
		releaseWithEverything.project.numRevisions += 1;
		await this.projectSource.save(releaseWithEverything.project);
		await this.releaseSource.save(releaseCopy)

		await this.copySprints(releaseCopy, releaseWithEverything.getSprints());
		await this.copyReleaseBacklog(releaseCopy, releaseWithEverything.getBacklog());
		await this.copyReleaseDeletedStories(releaseCopy, releaseWithEverything.getDeletedBacklogItems());

		return releaseCopy
	}

	/// return list sorted by ascending sprint number
	public async getReleaseSprints(releaseId: number): Promise<Sprint[]> {
		const sprints = await this.sprintSource.getSprintsWithBacklogAndScrumMasters(releaseId);
		for (const sprint of sprints) {
			sprint.todos.sort((a: BacklogItem, b: BacklogItem) => a.rank - b.rank);
		}
		return sprints
	}

	/// return new order sorted by ascending sprint number
	public async reorderSprints(releaseId: number, startIndex: number, destinationIndex: number): Promise<Sprint[]> {
		const sprints = await this.sprintSource.getSprintsWithBacklogAndScrumMasters(releaseId)
		const [item] = sprints.splice(startIndex, 1)
		sprints.splice(destinationIndex, 0, item)
		for (const { sprint, index } of sprints.map((sprint, index) => ({ sprint, index }))) {
			sprint.sprintNumber = index + 1;
			sprint.todos.sort((a, b) => a.rank - b.rank);
			await this.sprintSource.save(sprint)
		}
		// await this.dataSource.save(sprints)
		return sprints;
	}

	public async moveSprintTodosToBacklog(releaseId: number, sprintId: number): Promise<BacklogItem[]> {
		const sprintWithTodos = await this.sprintSource.lookupSprintByIdWithTodos(sprintId);
		const releaseWithBacklog = await this.releaseSource.fetchReleaseWithBacklog(releaseId);
		releaseWithBacklog.backlog = sprintWithTodos.todos.concat(releaseWithBacklog.backlog);
		releaseWithBacklog.backlog.forEach((item, index) => item.rank = index);
		for (const backlogItem of releaseWithBacklog.backlog) {
			await this.backlogSource.save(backlogItem);
		}
		await this.releaseSource.save(releaseWithBacklog);
		sprintWithTodos.todos = [];
		await this.sprintSource.save(sprintWithTodos);
		return releaseWithBacklog.backlog;
	}

	/// return new list sorted by ascending sprint number, and the new bakclog
	public async removeSprintFromRelease(sprintId: number): Promise<[Sprint[], BacklogItem[]]> {
		const sprintWithRelease = await this.sprintSource.lookupSprintByIdWithRelease(sprintId)
		const newProductBacklog = await this.moveSprintTodosToBacklog(sprintWithRelease.release.id, sprintId)
		await this.sprintSource.deleteSprint(sprintId)
		const releaseWithSprints = await this.fetchReleaseWithSprints(sprintWithRelease.release.id)
		const sprintIndexPairs = releaseWithSprints.sprints.map((sprint, index) => ({ sprint, index }))
		for (const { sprint, index } of sprintIndexPairs) {
			sprint.sprintNumber = index + 1;
			sprint.todos.sort((a, b) => a.rank - b.rank);
			await this.sprintSource.save(sprint);
		}
		await this.releaseSource.save(releaseWithSprints)
		return [releaseWithSprints.sprints, newProductBacklog];
	}

	public async toggleSigning(userId: number, releaseId: number): Promise<(User[] | boolean)[]> {
		const releaseWithSignatures = await this.fetchReleaseWithSignatures(releaseId);
		const releaseWithProject = await this.releaseSource.fetchReleaseWithProject(releaseId);
		const projectWithMembers = await this.projectSource.lookupProjectByIdWithUsers(releaseWithProject.project.id);
		const allMembers = [projectWithMembers.productOwner, ...projectWithMembers.teamMembers];
		const userHasSigned = releaseWithSignatures.signatures.some((user) => user.id === userId);
		const isProductOwner = projectWithMembers.productOwner.id === userId;

		if (releaseWithSignatures.fullySigned || (releaseWithSignatures.signatures.length === 0 && !isProductOwner)) {
			// throw new SigningError(`User ${userId} has already signed release ${releaseId}.`);
			// throw new SigningError(`User ${userId} is not Product Owner`);
		} else if (userHasSigned) {
			releaseWithSignatures.signatures = releaseWithSignatures.signatures.filter((user) => user.id !== userId);
		} else {
			const userToAdd = await this.userSource.lookupUserById(userId);
			releaseWithSignatures.addSignature(userToAdd);

			releaseWithSignatures.fullySigned = releaseWithSignatures.signatures.length === projectWithMembers.teamMembers.length + 1;
		}

		await this.releaseSource.save(releaseWithSignatures);

		// set difference
		const unsignedMembers = allMembers.filter((member) => !releaseWithSignatures.signatures.some((signature) => signature.id === member.id));

		return [unsignedMembers, releaseWithSignatures.signatures, releaseWithSignatures.fullySigned];
	}

	public async getSignatures(releaseId: number): Promise<(User[] | boolean)[]> {
		const releaseWithSignatures = await this.fetchReleaseWithSignatures(releaseId);
		const releaseWithProject = await this.releaseSource.fetchReleaseWithProject(releaseId);
		const projectWithMembers = await this.projectSource.lookupProjectByIdWithUsers(releaseWithProject.project.id);
		const allMembers = [projectWithMembers.productOwner, ...projectWithMembers.teamMembers];
		const unsignedMembers = allMembers.filter((member) => !releaseWithSignatures.signatures.some((signature) => signature.id === member.id));
		return [unsignedMembers, releaseWithSignatures.signatures, releaseWithSignatures.fullySigned];
	}

	private backlogItemListHasUnestimated(backlogItemList: BacklogItem[]) {
		for (const backlogItem of backlogItemList) {
			if (!backlogItem.size) {
				return true;
			}
		}
		return false;
	}

	private sprintAttributesSet(sprint: Sprint) {
		return !sprint.startDate || !sprint.endDate || !sprint.scrumMaster;
	}

	public async getSigningCondition(releaseId: number): Promise<boolean> {
		const releaseWithBacklog = await this.fetchReleaseWithBacklog(releaseId);

		for (const sprint of releaseWithBacklog.sprints) {
			const sprintWithScrumMaster = await this.sprintSource.lookupSprintByIdWithScrumMaster(sprint.id);
			if (this.sprintAttributesSet(sprintWithScrumMaster) || this.backlogItemListHasUnestimated(sprint.todos)) {
				return false;
			}
		}
		if (this.backlogItemListHasUnestimated(releaseWithBacklog.backlog)) {
			return false
		}

		return true;
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

	public async fetchReleaseWithSignatures(releaseId: number): Promise<Release> {
		return await this.releaseSource.fetchReleaseWithSignatures(releaseId);
	}

	public async fetchReleaseWithEverything(releaseId: number): Promise<Release> {
		return await this.releaseSource.fetchReleaseWithEverything(releaseId);
	}


}