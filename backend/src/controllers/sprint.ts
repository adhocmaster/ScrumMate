import express from 'express';
import { Database } from '../db/database';
import { verifyParameters } from './utils/verifyParams';

export const createSprint = async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance();
	const { releaseId } = req.params;
	const {
		sprintNumber,
		startDate,
		endDate,
		goal,
	} = req.body;
	verifyParameters(sprintNumber);
	const newSprint = await db.getSprintRepository.createNewSprint(parseInt(releaseId), sprintNumber, startDate, endDate, goal);
	return res.json(newSprint);
};

export const editSprint = async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance();
	const { sprintId } = req.params;
	const {
		sprintNumber,
		startDate,
		endDate,
		goal,
		scrumMasterId,
	} = req.body;
	const sprint = await db.getSprintRepository.updateSprint(parseInt(sprintId), sprintNumber, startDate, endDate, goal, parseInt(scrumMasterId));
	return res.json(sprint);
}

export const getSprints = async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance();
	const { releaseId } = req.params;
	verifyParameters(releaseId);
	const sprintList = await db.getReleaseRepository.getReleaseSprints(parseInt(releaseId));
	return res.json(sprintList);
}

export const getSprintWithRelease = async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance();
	const { sprintId } = req.params;
	verifyParameters(sprintId);
	const sprintList = await db.getSprintRepository.lookupSprintByIdWithRelease(parseInt(sprintId));
	return res.json(sprintList);
}

export const moveSprint = async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance();
	const { releaseId } = req.params;
	const {
		sprintStartIndex,
		sprintEndIndex
	} = req.body;
	verifyParameters(releaseId, sprintStartIndex, sprintEndIndex);
	const sprintList = await db.getReleaseRepository.reorderSprints(parseInt(releaseId), parseInt(sprintStartIndex), parseInt(sprintEndIndex));
	return res.json(sprintList);
}

export const deleteSprint = async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance();
	const { sprintId } = req.params;
	verifyParameters(sprintId);
	const newSprintList = await db.getReleaseRepository.removeSprintFromRelease(parseInt(sprintId));
	return res.json(newSprintList);
}