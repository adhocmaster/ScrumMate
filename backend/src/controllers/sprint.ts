import express from 'express';
import { Database } from '../data-source';
import { verifyParameters } from './utils/verifyParams';

export const createSprint = async(req: express.Request, res: express.Response) => {
	const db = Database.getInstance()
	const { releaseId } = req.params
	const {
		sprintNumber,
		startDate,
		endDate,
		goal,
	} = req.body
	const newSprint = await db.createNewSprint(parseInt(releaseId), sprintNumber, startDate, endDate, goal)
	return res.json(newSprint)
};

export const editSprint = async(req: express.Request, res: express.Response) => {
	const db = Database.getInstance()
	const { sprintId } = req.params
	const {
		sprintNumber,
		startDate,
		endDate,
		goal,
	} = req.body
	const sprint = await db.createNewSprint(parseInt(sprintId), sprintNumber, startDate, endDate, goal)
	return res.json(sprint)
}