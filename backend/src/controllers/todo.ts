import express from 'express';
import { AppDataSource } from "../data-source";
import { Story } from "../entity/backlog";
import { Sprint } from "../entity/sprint";

export const createStory = async(req: express.Request, res: express.Response) => {
  const { sprintId } = req.params
	const sprint = await AppDataSource.manager.findOneBy(Sprint, {id: parseInt(sprintId)})
	const {
		userTypes,
		functionalityDescription,
		reasoning,
		acceptanceCriteria,
		storyPoints,
		priority,
	} = req.body

	const newStory = new Story()
	newStory.userTypes = userTypes
	newStory.functionalityDescription = functionalityDescription
	newStory.reasoning = reasoning
	newStory.acceptanceCriteria = acceptanceCriteria
	newStory.storyPoints = storyPoints
	newStory.priority = priority
	newStory.sprint = sprint
	sprint.addTODO(newStory) // not sure if need to do. need to load sprint's relation?

	await AppDataSource.manager.save(newStory)
	// await AppDataSource.manager.save(sprint)
	return res.json(newStory)
}

export const editStory = async(req: express.Request, res: express.Response) => {
  const { sprintId, storyId } = req.params
  const sprint = await AppDataSource.manager.findOneBy(Sprint, {id: parseInt(sprintId)})
  const story = await AppDataSource.manager.findOneBy(Story, {id: parseInt(storyId)})
  const {
    userTypes,
    functionalityDescription,
    reasoning,
    acceptanceCriteria,
    storyPoints,
    priority,
  } = req.body

  story.userTypes = userTypes ?? story.userTypes
  story.functionalityDescription = functionalityDescription ?? story.functionalityDescription
  story.reasoning = reasoning ?? story.reasoning
  story.acceptanceCriteria = acceptanceCriteria ?? story.acceptanceCriteria
  story.storyPoints = storyPoints ?? story.storyPoints
  story.priority = priority ?? story.priority
  if (sprint) {
    story.sprint.removeTODO(story) // may need to fix the remove method, match on id
    story.sprint = sprint
    sprint.addTODO(story) // again, might break
  }

  await AppDataSource.manager.save(story)
  return res.json(story)
};