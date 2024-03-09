import express from "express";
import { Database } from "../db/database";
import { verifyParameters } from './utils/verifyParams';

export const newRelease = async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance()
	const { projectId } = req.params
	const {
		revision,
		revisionDate,
		problemStatement,
		goalStatement,
	} = req.body
	if(!verifyParameters(projectId)) return res.sendStatus(400);

  	// if(!verifyParameters(projectId, revision, revisionDate, problemStatement, goalStatement)) {
	const release = await db.createNewRelease(parseInt(projectId), revision, revisionDate, problemStatement, goalStatement)
	return res.json(release)
};

export const editRelease = async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance()
	const { releaseId } = req.params
	const {
		revisionDate,
		problemStatement,
		goalStatement,
	} = req.body
	const release = await db.updateRelease(parseInt(releaseId), revisionDate, problemStatement, goalStatement)
	return res.json(release)
};

export const copyRelease = async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance()
	const {releaseId} = req.params;
	const release = await db.copyRelease(parseInt(releaseId))
	return res.json(release)
};

export const getRelease = async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance()
	const {releaseId} = req.params;
	const release = await db.fetchReleaseWithProject(parseInt(releaseId))
	return res.json(release)
};

export const getReleaseAndBacklog = async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance()
	const {releaseId} = req.params;
	const release = await db.fetchReleaseWithBacklog(parseInt(releaseId))
	return res.json(release)
};