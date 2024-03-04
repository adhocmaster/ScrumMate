import express from 'express';
import { Database } from '../db/database';
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
	if(!verifyParameters(sprintNumber, startDate, endDate, goal)) return res.sendStatus(400);	
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
	const sprint = await db.updateSprint(parseInt(sprintId), sprintNumber, startDate, endDate, goal)
	return res.json(sprint)
}

export const getSprints = async(req: express.Request, res: express.Response) => {
	const db = Database.getInstance()
	const { releaseId } = req.params
	if (!verifyParameters(releaseId)) return res.sendStatus(400)
	const sprintList = await db.getReleaseSprints(parseInt(releaseId))
	return res.json(sprintList)
}