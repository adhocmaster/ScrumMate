import { Priority, Story } from "../../entity/backlogItem";
import { DataSourceWrapper } from "../dataSourceWrapper";

export class BacklogItemRepository {
	dataSource: DataSourceWrapper

	constructor (dataSource: DataSourceWrapper) {
		this.dataSource = dataSource
	}

	public async createNewStory(sprintId: number, userTypes: string, functionalityDescription: string, reasoning: string, acceptanceCriteria: string, storyPoints: number, priority: Priority): Promise<Story> {
		const sprint = await this.dataSource.lookupSprintById(sprintId)
		const newStory = new Story()
		newStory.userTypes = userTypes
		newStory.functionalityDescription = functionalityDescription
		newStory.reasoning = reasoning
		newStory.acceptanceCriteria = acceptanceCriteria
		newStory.storyPoints = storyPoints
		newStory.priority = priority
		newStory.sprint = sprint
		await this.dataSource.save(newStory)
		return newStory
	}

	public async updateStory(storyId: number, sprintId?: number, userTypes?: string, functionalityDescription?: string, reasoning?: string, acceptanceCriteria?: string, storyPoints?: number, priority?: Priority): Promise<Story> {
		const sprint = await this.dataSource.lookupSprintById(sprintId)
		const story = await this.dataSource.lookupStoryById(storyId)
		story.userTypes = userTypes ?? story.userTypes
		story.functionalityDescription = functionalityDescription ?? story.functionalityDescription
		story.reasoning = reasoning ?? story.reasoning
		story.acceptanceCriteria = acceptanceCriteria ?? story.acceptanceCriteria
		story.storyPoints = storyPoints ?? story.storyPoints
		story.priority = priority ?? story.priority
		// if (sprint) {
		//   story.sprint.removeTODO(story) // may need to fix the remove method, match on id
		//   story.sprint = sprint
		//   sprint.addTODO(story) // again, might break
		// }
		await this.dataSource.save(story)
		return story;
	}

}