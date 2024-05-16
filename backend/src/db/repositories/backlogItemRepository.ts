import { Release } from "../../entity/release";
import { BacklogItem, Priority, Story } from "../../entity/backlogItem";
import { ModelRepository } from "./modelRepository";
import { NotFoundError } from "../../helpers/errors";
import { Sprint } from "../../entity/sprint";
import { shuffle } from "lodash";
import { Project } from "../../entity/project";

export class BacklogItemRepository extends ModelRepository {

	public async createNewSprintStory(sprintId: number, userTypes: string, functionalityDescription: string, reasoning: string, acceptanceCriteria: string, storyPoints: number, priority: Priority): Promise<Story> {
		const sprint = await this.sprintSource.lookupSprintById(sprintId)
		const newStory = new Story()
		newStory.userTypes = userTypes
		newStory.functionalityDescription = functionalityDescription
		newStory.reasoning = reasoning
		newStory.acceptanceCriteria = acceptanceCriteria
		newStory.size = storyPoints
		newStory.priority = priority
		newStory.sprint = sprint
		newStory.rank = sprint.backlogItemCount
		await this.backlogSource.save(newStory)
		sprint.backlogItemCount += 1
		await this.sprintSource.save(sprint)
		return newStory
	}

	public async createNewBacklogStory(releaseId: number, userTypes: string, functionalityDescription: string, reasoning: string, acceptanceCriteria: string, storyPoints: number, priority: Priority): Promise<Story> {
		const release = await this.releaseSource.lookupReleaseById(releaseId)
		const newStory = new Story()
		newStory.userTypes = userTypes
		newStory.functionalityDescription = functionalityDescription
		newStory.reasoning = reasoning
		newStory.acceptanceCriteria = acceptanceCriteria
		newStory.size = storyPoints
		newStory.priority = priority
		newStory.release = release
		newStory.rank = release.backlogItemCount
		await this.backlogSource.save(newStory)
		release.backlogItemCount += 1
		await this.releaseSource.save(release)
		return newStory
	}

	public async updateStory(storyId: number, userTypes?: string, functionalityDescription?: string, reasoning?: string, acceptanceCriteria?: string, storyPoints?: number, priority?: Priority, rank?: number): Promise<Story> {
		const story = await this.backlogSource.lookupStoryById(storyId)
		story.userTypes = userTypes ?? story.userTypes
		story.functionalityDescription = functionalityDescription ?? story.functionalityDescription
		story.reasoning = reasoning ?? story.reasoning
		story.acceptanceCriteria = acceptanceCriteria ?? story.acceptanceCriteria
		story.size = storyPoints ?? story.size
		story.priority = priority ?? story.priority
		await this.backlogSource.save(story)
		return story;
	}

	// for each reordering, just take it out of the source, renumber the source, put it in the destination with new rank, and renumber the destination
	public async reorderBacklog(sourceId: number, sourceType: string, sourceIndex: number, destinationId: number, destinationType: string, destinationIndex: number): Promise<[BacklogItem[], BacklogItem[]]> {
		const getObj = async (backlog: boolean, id: number) => {
			if (backlog) {
				return await this.releaseSource.fetchReleaseWithBacklog(id);
			} else {
				return await this.sprintSource.lookupSprintByIdWithTodos(id)
			}
		}
		const getObjList = (obj: Release | Sprint) => {
			if (obj instanceof Release) {
				return obj.backlog
			} else {
				return obj.todos
			}
		}
		const saveObj = async (obj: Release | Sprint) => {
			if (obj instanceof Release) {
				await this.releaseSource.save(obj)
			} else {
				await this.sprintSource.save(obj)
			}
		}
		const setParent = (backlogItem: BacklogItem, parent: Release | Sprint) => {
			if (parent instanceof Release) {
				backlogItem.release = parent
				backlogItem.sprint = undefined
			} else {
				backlogItem.release = undefined
				backlogItem.sprint = parent
			}
		}

		const fromBacklog = sourceType === "backlog";
		const toBacklog = destinationType === "backlog";

		const sourceObj = await getObj(fromBacklog, sourceId)
		const sourceList = getObjList(sourceObj)
		const destinationObj = await getObj(toBacklog, destinationId)
		const destinationList = getObjList(destinationObj)

		if (sourceIndex >= sourceList.length) {
			throw new NotFoundError("Source index is out of bounds")
		}
		if (destinationIndex > destinationList.length) {
			throw new NotFoundError("Destination index is out of bounds")
		}

		sourceList.sort((a: BacklogItem, b: BacklogItem) => a.rank - b.rank)
		const [item] = sourceList.splice(sourceIndex, 1)
		for (const { backlogItem, index } of sourceList.map((backlogItem, index) => ({ backlogItem, index }))) {
			backlogItem.rank = index;
			await this.backlogSource.save(backlogItem)
		}
		sourceObj.backlogItemCount -= 1;
		await saveObj(sourceObj)

		destinationList.sort((a: BacklogItem, b: BacklogItem) => a.rank - b.rank)
		destinationList.splice(destinationIndex, 0, item)
		for (const { backlogItem, index } of destinationList.map((backlogItem, index) => ({ backlogItem, index }))) {
			backlogItem.rank = index;
			await this.backlogSource.save(backlogItem)
		}
		destinationObj.backlogItemCount += 1;
		await saveObj(destinationObj)

		setParent(item, destinationObj)
		await this.backlogSource.save(item)
		item.sprint = undefined
		item.release = undefined

		return [sourceList, destinationList]
	}

	private async moveBacklogItemToDeletedList(backlogItemWithParent: BacklogItem) {
		const parentSprint = backlogItemWithParent.sprint;
		const parentRelease = backlogItemWithParent.release;
		if (backlogItemWithParent.sprint) {
			const sprintWithRelease = await this.sprintSource.lookupSprintByIdWithRelease(backlogItemWithParent.sprint.id);
			backlogItemWithParent.deletedFrom = sprintWithRelease.release;
			backlogItemWithParent.sprint = null;
		} else {
			backlogItemWithParent.deletedFrom = backlogItemWithParent.release;
		}
		backlogItemWithParent.release = null;
		await this.backlogSource.save(backlogItemWithParent);
		backlogItemWithParent.sprint = parentSprint;
		backlogItemWithParent.release = parentRelease;
	}

	public async deleteBacklogItem(backlogItemId: number): Promise<BacklogItem[]> {
		const backlogItem = await this.backlogSource.fetchBacklogWithParent(backlogItemId);
		await this.moveBacklogItemToDeletedList(backlogItem);
		// await this.backlogSource.deleteBacklogItem(backlogItemId);

		if (backlogItem.sprint) {
			// sprint is parent
			const sprint = await this.sprintSource.lookupSprintByIdWithTodos(backlogItem.sprint.id);
			sprint.todos.sort((a: BacklogItem, b: BacklogItem) => a.rank - b.rank)
			for (const { backlogItem, index } of sprint.todos.map((backlogItem, index) => ({ backlogItem, index }))) {
				backlogItem.rank = index;
				await this.backlogSource.save(backlogItem)
			}
			return sprint.todos;
		} else {
			// backlog is parent
			const release = await this.releaseSource.fetchReleaseWithBacklog(backlogItem.release.id);
			release.backlog.sort((a: BacklogItem, b: BacklogItem) => a.rank - b.rank)
			for (const { backlogItem, index } of release.backlog.map((backlogItem, index) => ({ backlogItem, index }))) {
				backlogItem.rank = index;
				await this.backlogSource.save(backlogItem)
			}
			return release.backlog
		}
	}

	public async getBacklogItemPoker(backlogItemId: number, userId: number): Promise<Object> {
		async function getProjectWithUsersFromBacklog(backlogItemId: number, repository: BacklogItemRepository): Promise<Project> {
			const backlogItemWithParent = await repository.backlogSource.fetchBacklogWithParent(backlogItemId);
			var release = backlogItemWithParent.release;
			if (backlogItemWithParent.sprint) {
				release = (await repository.sprintSource.lookupSprintByIdWithRelease(backlogItemWithParent.sprint.id)).release;
			}
			const project = (await repository.releaseSource.fetchReleaseWithProject(release.id)).project;
			const projectWithUsers = await repository.projectSource.lookupProjectByIdWithUsers(project.id);
			return projectWithUsers;
		}

		async function getTeamInfo(backlogItemWithPoker: BacklogItem, repository: BacklogItemRepository): Promise<(string | boolean)[][]> {
			const pokerUserIdStrings = Object.keys(backlogItemWithPoker.estimates);
			const projectWithUsers = await getProjectWithUsersFromBacklog(backlogItemWithPoker.id, repository);

			const shuffledPokerIdNumbers = shuffle(pokerUserIdStrings.map((idString) => parseInt(idString)))
			const shuffledPokerIdsWithoutUser = shuffledPokerIdNumbers.filter((id) => id !== userId);
			const pokerUsersWithoutUserWithPreviousEstimatesAndCurrentStatuses = shuffledPokerIdsWithoutUser.map((id: number) => {
				const [currentEstimate, previousEstimate, submitted] = backlogItemWithPoker.estimates[id];
				return [String(previousEstimate), submitted]
			});

			const pokerEstimates = Object.values(backlogItemWithPoker.estimates);
			const numTeamMembers = projectWithUsers.teamMembers.length + 1;
			const numEstimates = pokerEstimates.length;
			const userHasEstimated = backlogItemWithPoker.estimates.hasOwnProperty(userId);
			const numberOfUnestimatedTeamMembers = numTeamMembers - numEstimates;
			const numberOfUnestimatedTeamMembersWithoutUser = numberOfUnestimatedTeamMembers - Number(!userHasEstimated);

			const unestimatedTeamMembers = Array.from({ length: numberOfUnestimatedTeamMembersWithoutUser }, () => [...["", false]])

			return [...pokerUsersWithoutUserWithPreviousEstimatesAndCurrentStatuses, ...unestimatedTeamMembers];
		}


		const backlogItemWithPoker = await this.backlogSource.lookupBacklogById(backlogItemId);
		const userHasEstimated = backlogItemWithPoker.estimates.hasOwnProperty(userId);
		return {
			pokerIsOver: backlogItemWithPoker.pokerIsOver,
			userEstimate: userHasEstimated ? backlogItemWithPoker.estimates[userId] : ["", false],
			othersEstimates: await getTeamInfo(backlogItemWithPoker, this),
			size: backlogItemWithPoker.size,
			rank: backlogItemWithPoker.rank,
		}
	}

	// public async placePokerEstimate(backlogItemId: number, estimate: number, userId: number) {
	// 	const backlogItemWithPoker = await this.backlogSource.lookupBacklogById(backlogItemId);
	// 	backlogItemWithPoker.estimates[userId] = estimate;
	// 	await this.backlogSource.save(backlogItemWithPoker);
	// }

	public async lookupBacklogById(id: number): Promise<BacklogItem> {
		return await this.backlogSource.lookupBacklogById(id);
	}

	public async lookupStoryById(id: number): Promise<Story> {
		return await this.backlogSource.lookupStoryById(id);
	}

}