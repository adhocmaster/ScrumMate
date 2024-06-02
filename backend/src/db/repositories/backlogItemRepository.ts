import { Release } from "../../entity/release";
import { ActionItem, ActionType, BacklogItem, Priority, Story } from "../../entity/backlogItem";
import { ModelRepository } from "./modelRepository";
import { NotFoundError } from "../../helpers/errors";
import { Sprint } from "../../entity/sprint";
import { shuffle } from "lodash";
import { Project } from "../../entity/project";

export class BacklogItemRepository extends ModelRepository {

	public async createNewSprintStory(sprintId: number, userTypes: string, functionalityDescription: string, reasoning: string, acceptanceCriteria: string, priority: Priority, storyPoints?: number): Promise<Story> {
		const sprint = await this.sprintSource.lookupSprintById(sprintId)
		const newStory = new Story()
		newStory.userTypes = userTypes
		newStory.functionalityDescription = functionalityDescription
		newStory.reasoning = reasoning
		newStory.acceptanceCriteria = acceptanceCriteria
		newStory.priority = priority
		newStory.sprint = sprint
		newStory.rank = sprint.backlogItemCount
		newStory.size = storyPoints ?? null;
		await this.backlogSource.save(newStory)
		sprint.backlogItemCount += 1
		await this.sprintSource.save(sprint)
		return newStory
	}

	public async createNewBacklogStory(releaseId: number, userTypes: string, functionalityDescription: string, reasoning: string, acceptanceCriteria: string, priority: Priority, storyPoints?: number): Promise<Story> {
		const release = await this.releaseSource.lookupReleaseById(releaseId)
		const newStory = new Story()
		newStory.userTypes = userTypes
		newStory.functionalityDescription = functionalityDescription
		newStory.reasoning = reasoning
		newStory.acceptanceCriteria = acceptanceCriteria
		newStory.priority = priority
		newStory.release = release
		newStory.rank = release.backlogItemCount
		newStory.size = storyPoints ?? null;
		await this.backlogSource.save(newStory)
		release.backlogItemCount += 1
		await this.releaseSource.save(release)
		return newStory
	}

	public async createNewSprintAction(sprintId: number, actionType: ActionType, description: string, priority: Priority, storyPoints?: number): Promise<ActionItem> {
		const sprint = await this.sprintSource.lookupSprintById(sprintId)
		const newAction = new ActionItem()
		newAction.actionType = actionType
		newAction.description = description
		newAction.priority = priority
		newAction.sprint = sprint
		newAction.rank = sprint.backlogItemCount
		newAction.size = storyPoints ?? null;
		await this.backlogSource.save(newAction)
		sprint.backlogItemCount += 1
		await this.sprintSource.save(sprint)
		return newAction
	}

	public async createNewBacklogAction(releaseId: number, actionType: ActionType, description: string, priority: Priority, storyPoints?: number): Promise<ActionItem> {
		const release = await this.releaseSource.lookupReleaseById(releaseId)
		const newAction = new ActionItem()
		newAction.actionType = actionType
		newAction.description = description
		newAction.priority = priority
		newAction.release = release
		newAction.rank = release.backlogItemCount
		newAction.size = storyPoints ?? null;
		await this.backlogSource.save(newAction)
		release.backlogItemCount += 1
		await this.releaseSource.save(release)
		return newAction
	}

	public async updateStory(storyId: number, userTypes?: string, functionalityDescription?: string, reasoning?: string, acceptanceCriteria?: string, storyPoints?: number, priority?: Priority, rank?: number): Promise<Story> {
		const story = await this.backlogSource.lookupBacklogById(storyId) as Story
		story.userTypes = userTypes ?? story.userTypes
		story.functionalityDescription = functionalityDescription ?? story.functionalityDescription
		story.reasoning = reasoning ?? story.reasoning
		story.acceptanceCriteria = acceptanceCriteria ?? story.acceptanceCriteria
		story.size = storyPoints ?? story.size
		story.priority = priority ?? story.priority
		await this.backlogSource.save(story)
		return story;
	}

	public async updateAction(actionId: number, actionType?: ActionType, description?: string, storyPoints?: number, rank?: number, priority?: Priority): Promise<ActionItem> {
		const actionItem = await this.backlogSource.lookupBacklogById(actionId) as ActionItem;
		actionItem.actionType = actionType ?? actionItem.actionType
		actionItem.description = description ?? actionItem.description
		actionItem.size = storyPoints ?? actionItem.size
		actionItem.priority = priority ?? actionItem.priority
		actionItem.rank = rank ?? actionItem.rank
		await this.backlogSource.save(actionItem)
		return actionItem;
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
		const resetRanks = async (backlogItemList: BacklogItem[]) => {
			for (const { backlogItem, index } of backlogItemList.map((backlogItem, index) => ({ backlogItem, index }))) {
				backlogItem.rank = index;
				await this.backlogSource.save(backlogItem);
			}
		}

		const fromBacklog = sourceType === "backlog";
		const toBacklog = destinationType === "backlog";

		// remove backlogItem from source
		const sourceObj = await getObj(fromBacklog, sourceId)
		const sourceList = getObjList(sourceObj)
		if (sourceIndex >= sourceList.length) {
			throw new NotFoundError("Source index is out of bounds")
		}
		sourceList.sort((a: BacklogItem, b: BacklogItem) => a.rank - b.rank)
		const [item] = sourceList.splice(sourceIndex, 1)
		await resetRanks(sourceList);
		sourceObj.backlogItemCount -= 1;
		await saveObj(sourceObj);

		// add backlogItem to destination
		const destinationObj = await getObj(toBacklog, destinationId)
		const destinationList = getObjList(destinationObj)
		if (destinationIndex > destinationList.length) {
			throw new NotFoundError("Destination index is out of bounds")
		}
		destinationList.sort((a: BacklogItem, b: BacklogItem) => a.rank - b.rank);
		destinationList.splice(destinationIndex, 0, item);
		await resetRanks(destinationList);
		destinationObj.backlogItemCount += 1;
		await saveObj(destinationObj);

		// set backlogItem's parent
		setParent(item, destinationObj);
		await this.backlogSource.save(item);
		item.sprint = undefined;
		item.release = undefined;

		// fetch updated source list (in case source == destination)
		const finalSourceObj = await getObj(fromBacklog, sourceId);
		const finalSourceList = getObjList(finalSourceObj);
		finalSourceList.sort((a: BacklogItem, b: BacklogItem) => a.rank - b.rank)

		return [finalSourceList, destinationList]
	}

	private async moveBacklogItemToDeletedList(backlogItemWithParent: BacklogItem) {
		// exactly one of them is null
		const parentSprint = backlogItemWithParent.sprint;
		const parentRelease = backlogItemWithParent.release;

		// add to deletedFrom list
		if (backlogItemWithParent.sprint) {
			const sprintWithRelease = await this.sprintSource.lookupSprintByIdWithRelease(backlogItemWithParent.sprint.id);
			backlogItemWithParent.deletedFrom = sprintWithRelease.release;
			backlogItemWithParent.sprint = null;
		} else {
			backlogItemWithParent.deletedFrom = backlogItemWithParent.release;
		}

		// save info in backlog Item
		backlogItemWithParent.release = null;
		await this.backlogSource.save(backlogItemWithParent);
		backlogItemWithParent.sprint = parentSprint;
		backlogItemWithParent.release = parentRelease;
	}

	public async deleteBacklogItem(backlogItemId: number): Promise<[number, BacklogItem[]]> {
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
			sprint.backlogItemCount -= 1;
			await this.sprintSource.save(sprint);
			return [sprint.sprintNumber, sprint.todos];
		} else {
			// backlog is parent
			const release = await this.releaseSource.fetchReleaseWithBacklog(backlogItem.release.id);
			for (const { backlogItem, index } of release.backlog.map((backlogItem, index) => ({ backlogItem, index }))) {
				backlogItem.rank = index;
				await this.backlogSource.save(backlogItem)
			}
			release.backlogItemCount -= 1;
			await this.releaseSource.save(release);
			return [0, release.backlog]
		}
	}

	private async getProjectWithUsersFromBacklog(backlogItemId: number): Promise<Project> {
		const backlogItemWithParent = await this.backlogSource.fetchBacklogWithParent(backlogItemId);
		var release = backlogItemWithParent.release;
		if (backlogItemWithParent.sprint) {
			release = (await this.sprintSource.lookupSprintByIdWithRelease(backlogItemWithParent.sprint.id)).release;
		}
		const project = (await this.releaseSource.fetchReleaseWithProject(release.id)).project;
		const projectWithUsers = await this.projectSource.lookupProjectByIdWithUsers(project.id);
		return projectWithUsers;
	}

	public async getBacklogItemPoker(backlogItemId: number, userId: number): Promise<Object> {
		function getTeamInfoFromBacklogItemEstimates(pokerUserIdStrings: string[]) {
			const shuffledPokerIdNumbers = shuffle(pokerUserIdStrings.map((idString) => parseInt(idString)))
			const shuffledPokerIdsWithoutUser = shuffledPokerIdNumbers.filter((id) => id !== userId);
			const pokerUsersWithoutUserWithPreviousEstimatesAndCurrentStatuses = shuffledPokerIdsWithoutUser.map((id: number) => {
				const [currentEstimate, previousEstimate, submitted] = backlogItemWithPoker.estimates[id];
				return [backlogItemWithPoker.pokerIsOver ? currentEstimate : previousEstimate, submitted]
			});
			return pokerUsersWithoutUserWithPreviousEstimatesAndCurrentStatuses;
		}

		function getTeamInfoFromProject(backlogItemWithPoker: BacklogItem, projectWithUsers: Project) {
			const pokerEstimates = Object.values(backlogItemWithPoker.estimates);
			const numTeamMembers = projectWithUsers.teamMembers.length + 1;
			const numEstimates = pokerEstimates.length;
			const userHasEstimated = backlogItemWithPoker.estimates.hasOwnProperty(userId);
			const numberOfUnestimatedTeamMembers = numTeamMembers - numEstimates;
			const numberOfUnestimatedTeamMembersWithoutUser = numberOfUnestimatedTeamMembers - Number(!userHasEstimated);
			const unestimatedTeamMembers = Array.from({ length: numberOfUnestimatedTeamMembersWithoutUser }, () => [...["", false]])
			return unestimatedTeamMembers;
		}

		async function getTeamInfo(backlogItemWithPoker: BacklogItem, repository: BacklogItemRepository): Promise<(string | boolean)[][]> {
			const pokerUserIdStrings = Object.keys(backlogItemWithPoker.estimates);
			const projectWithUsers = await repository.getProjectWithUsersFromBacklog(backlogItemWithPoker.id);

			const teamInfoFromPokerEstimates = getTeamInfoFromBacklogItemEstimates(pokerUserIdStrings);
			const teamInfoFromProject = getTeamInfoFromProject(backlogItemWithPoker, projectWithUsers)

			return [...teamInfoFromPokerEstimates, ...teamInfoFromProject];
		}

		const backlogItemWithPoker = await this.backlogSource.lookupBacklogById(backlogItemId);
		const userHasEstimated = backlogItemWithPoker.estimates.hasOwnProperty(userId);

		var userEstimate;
		if (userHasEstimated) {
			const [currentEstimate, previousEstimate, submitted] = backlogItemWithPoker.estimates[userId];
			userEstimate = [currentEstimate, submitted];
		} else {
			userEstimate = ["", false];
		}

		return {
			pokerIsOver: backlogItemWithPoker.pokerIsOver,
			userEstimate: userEstimate,
			othersEstimates: await getTeamInfo(backlogItemWithPoker, this),
			size: backlogItemWithPoker.size,
			rank: backlogItemWithPoker.rank,
		}
	}

	public async placePokerEstimate(backlogItemId: number, estimate: number, userId: number): Promise<void> {
		function nextRoundPoker(backlogItemWithPoker: BacklogItem, projectWithUsers: Project): void {
			const estimatedUserIds = Object.keys(backlogItemWithPoker.estimates);
			const teamMemberIds = projectWithUsers.teamMembers.map(teamMember => teamMember.id).concat([projectWithUsers.productOwner.id]);
			for (const userIdWithEstimate of estimatedUserIds) {
				const userIdWithEstimateNumber = parseInt(userIdWithEstimate)
				if (!teamMemberIds.includes(userIdWithEstimateNumber)) {
					delete backlogItemWithPoker.estimates[userIdWithEstimateNumber];
					continue;
				}
				const [currentEstimate, previousEstimate, submitted] = backlogItemWithPoker.estimates[userIdWithEstimateNumber];
				backlogItemWithPoker.estimates[userIdWithEstimateNumber] = [currentEstimate, currentEstimate, false]
			}
			backlogItemWithPoker.pokerIsOver = false;
		}

		function getPreviousRoundEstimate(backlogItemWithPoker: BacklogItem, userId: number): string {
			const userHasEstimated = backlogItemWithPoker.estimates.hasOwnProperty(userId);
			const oldEstimate = userHasEstimated ? backlogItemWithPoker.estimates[userId][1] : "";
			return oldEstimate;
		}

		function roundComplete(projectWithUsers: Project, backlogItemWithPoker: BacklogItem): boolean {
			const estimatedUserIds = Object.keys(backlogItemWithPoker.estimates);
			const wholeTeamCounted = projectWithUsers.getTeamMembers().length + 1 <= estimatedUserIds.length;
			const everyoneHasSubmitted = Object.values(backlogItemWithPoker.estimates).every((tuple) => tuple[2])
			return wholeTeamCounted && everyoneHasSubmitted;
		}

		const backlogItemWithPoker = await this.backlogSource.lookupBacklogById(backlogItemId);
		const projectWithUsers = await this.getProjectWithUsersFromBacklog(backlogItemId);

		if (backlogItemWithPoker.pokerIsOver) {
			nextRoundPoker(backlogItemWithPoker, projectWithUsers);
		}

		const oldEstimate = getPreviousRoundEstimate(backlogItemWithPoker, userId)
		backlogItemWithPoker.estimates[userId] = [String(estimate), oldEstimate, true];

		if (roundComplete(projectWithUsers, backlogItemWithPoker)) {
			const everyEstimateEqual = Object.values(backlogItemWithPoker.estimates).every((tuple) => tuple[0] === backlogItemWithPoker.estimates[userId][0])
			if (everyEstimateEqual) {
				backlogItemWithPoker.pokerIsOver = true;
				backlogItemWithPoker.size = parseInt(backlogItemWithPoker.estimates[userId][0]);
			} else {
				nextRoundPoker(backlogItemWithPoker, projectWithUsers);
			}
		}

		await this.backlogSource.save(backlogItemWithPoker);
	}

	public async lookupBacklogById(id: number): Promise<BacklogItem> {
		return await this.backlogSource.lookupBacklogById(id);
	}

}