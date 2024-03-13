import { BacklogItem, Priority, Story } from "../../entity/backlogItem";
import { ModelRepository } from "./modelRepository";

export class BacklogItemRepository extends ModelRepository {

	public async createNewStory(sprintId: number, userTypes: string, functionalityDescription: string, reasoning: string, acceptanceCriteria: string, storyPoints: number, priority: Priority): Promise<Story> {
		const sprint = await this.sprintSource.lookupSprintById(sprintId)
		const newStory = new Story()
		newStory.userTypes = userTypes
		newStory.functionalityDescription = functionalityDescription
		newStory.reasoning = reasoning
		newStory.acceptanceCriteria = acceptanceCriteria
		newStory.storyPoints = storyPoints
		newStory.priority = priority
		newStory.sprint = sprint
		await this.backlogSource.save(newStory)
		return newStory
	}

	public async updateStory(storyId: number, sprintId?: number, userTypes?: string, functionalityDescription?: string, reasoning?: string, acceptanceCriteria?: string, storyPoints?: number, priority?: Priority): Promise<Story> {
		const sprint = await this.sprintSource.lookupSprintById(sprintId)
		const story = await this.backlogSource.lookupStoryById(storyId)
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
		await this.backlogSource.save(story)
		return story;
	}

	public async lookupBacklogById(id: number): Promise<BacklogItem> {
		return await this.backlogSource.lookupBacklogById(id);
	}
	
	public async lookupStoryById(id: number): Promise<Story> {
		return await this.backlogSource.lookupStoryById(id);
	}
	
}