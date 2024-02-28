import express from 'express';
import { Database } from "../data-source";
import { verifyParameters } from './utils/verifyParams';

export const createStory = async(req: express.Request, res: express.Response) => {
	const db = Database.getInstance()
	const { sprintId } = req.params
	const {
		userTypes,
		functionalityDescription,
		reasoning,
		acceptanceCriteria,
		storyPoints,
		priority,
	} = req.body
	// what to do if some are null?
	// if (!verifyParameters()) res.sendStatus(403)
	const newStory = await db.createNewStory(parseInt(sprintId), userTypes, functionalityDescription, reasoning, acceptanceCriteria, storyPoints, priority)
	return res.json(newStory)
}

export const editStory = async(req: express.Request, res: express.Response) => {
	const db = Database.getInstance()
	const { sprintId, storyId } = req.params
	const {
		userTypes,
		functionalityDescription,
		reasoning,
		acceptanceCriteria,
		storyPoints,
		priority,
	} = req.body
	const story = await db.updateStory(parseInt(sprintId), parseInt(sprintId), userTypes, functionalityDescription, reasoning, acceptanceCriteria, storyPoints, priority)
	return res.json(story)
};