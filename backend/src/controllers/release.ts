import express from "express";
import { Database } from "../db/database";
import { verifyParameters } from './utils/verifyParams';

export const newRelease = async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance();
	const { projectId } = req.params;
	const {
		revision,
		revisionDate,
		problemStatement,
		goalStatement,
	} = req.body
	verifyParameters(projectId);
	const release = await db.getReleaseRepository.createNewRelease(parseInt(projectId), revision, revisionDate, problemStatement, goalStatement);
	return res.json(release);
};

export const editRelease = async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance();
	const { releaseId } = req.params;
	const {
		revisionDate,
		problemStatement,
		goalStatement,
	} = req.body;
	const release = await db.getReleaseRepository.updateRelease(parseInt(releaseId), revisionDate, problemStatement, goalStatement);
	return res.json(release);
};

export const copyRelease = async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance();
	const { releaseId } = req.params;
	verifyParameters(releaseId);
	const release = await db.getReleaseRepository.copyRelease(parseInt(releaseId));
	return res.json(release);
};

export const getRelease = async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance();
	const { releaseId } = req.params;
	verifyParameters(releaseId);
	const release = await db.getReleaseRepository.fetchReleaseWithProject(parseInt(releaseId));
	return res.json(release);
};

export const getReleaseAndBacklog = async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance();
	const { releaseId } = req.params;
	verifyParameters(releaseId);
	const release = await db.getReleaseRepository.fetchReleaseWithBacklog(parseInt(releaseId));
	return res.json(release);
};

export const toggleSigning = async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance();
	const { releaseId } = req.params;
	verifyParameters(releaseId);
	const signatureLists = await db.getReleaseRepository.toggleSigning(req.userId, parseInt(releaseId));
	return res.json(signatureLists);
};

export const getSignatures = async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance();
	const { releaseId } = req.params;
	verifyParameters(releaseId);
	const signatureLists = await db.getReleaseRepository.getSignatures(parseInt(releaseId));
	return res.json(signatureLists);
};

export const getSigningCondition = async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance();
	const { releaseId } = req.params;
	verifyParameters(releaseId);
	const readyToSign = await db.getReleaseRepository.getSigningCondition(parseInt(releaseId));
	return res.json(readyToSign);
};