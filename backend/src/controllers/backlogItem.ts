import express from 'express';
import { Database } from "../data-source";
import { verifyParameters } from './utils/verifyParams';
import { NotFoundError, NotSavedError } from '../helpers/errors';

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
	try {
		const newStory = await db.createNewStory(parseInt(sprintId), userTypes, functionalityDescription, reasoning, acceptanceCriteria, storyPoints, priority)
		return res.json(newStory)
	} catch (err) {
		if (err instanceof NotFoundError) {
			return res.sendStatus(404)
		} else {
			return res.sendStatus(500)
		}
	}
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
	try {
		const story = await db.updateStory(parseInt(sprintId), parseInt(sprintId), userTypes, functionalityDescription, reasoning, acceptanceCriteria, storyPoints, priority)
		return res.json(story)
	} catch (err) {
		if (err instanceof NotFoundError) {
			return res.sendStatus(404)
		} else {
			return res.sendStatus(500)
		}
	}
};