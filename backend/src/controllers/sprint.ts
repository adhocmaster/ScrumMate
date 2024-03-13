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

export const getSprintWithRelease = async(req: express.Request, res: express.Response) => {
	const db = Database.getInstance()
	const { sprintId } = req.params
	if (!verifyParameters(sprintId)) return res.sendStatus(400)
	const sprintList = await db.lookupSprintByIdWithRelease(parseInt(sprintId))
	return res.json(sprintList)
}

export const moveSprint = async(req: express.Request, res: express.Response) => {
	const db = Database.getInstance()
	const { releaseId } = req.params
	const {
		sprintStartIndex,
		sprintEndIndex
	} = req.body
	if (!verifyParameters(releaseId, sprintStartIndex, sprintEndIndex)) return res.sendStatus(400)
	const sprintList = await db.reorderSprints(parseInt(releaseId), parseInt(sprintStartIndex), parseInt(sprintEndIndex))
	return res.json(sprintList)
}

export const deleteSprint = async(req: express.Request, res: express.Response) => {
	const db = Database.getInstance()
	const { sprintId } = req.params
	if (!verifyParameters(sprintId)) return res.sendStatus(400)
	const newSprintList = await db.removeSprintFromRelease(parseInt(sprintId))
	return res.json(newSprintList)
}