import express from 'express';
import { Database } from "../db/database";
import { verifyParameters } from './utils/verifyParams';

//User id param
export const newProject = async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance();
	const {
		name,
		userId
	} = req.body;
	verifyParameters(name);
	const newProject = await db.getProjectRepository.createNewProject(userId, name);
	return res.json(newProject);
};

export const joinProject = async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance();
	const { userId, projectId } = req.params;
	verifyParameters(projectId);
	const project = await db.getUserRepository.joinProject(parseInt(userId), parseInt(projectId));
	return res.json(project);
};

export const editProject = async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance();
	const { projectId } = req.params;
	const {
		name,
	} = req.body;
	verifyParameters(projectId, name);
	const project = await db.getProjectRepository.updateProject(parseInt(projectId), name);
	return res.json(project);
};

export const getReleases = async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance();
	const { projectId } = req.params
	verifyParameters(projectId);
	const project = await db.getProjectRepository.fetchProjectWithReleases(parseInt(projectId));
	return res.json(project);
};

export const getRecentRelease = async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance();
	const { projectId } = req.params;
	const release = await db.getProjectRepository.fetchMostRecentRelease(parseInt(projectId));
	return res.json(release);
};

export const getName = async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance();
	const { projectId } = req.params;
	const project = await db.getProjectRepository.lookupProjectById(parseInt(projectId));
	return res.json(project.name);
};

export const getRowData = async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance();
	const { projectId } = req.params;
	const projectData = await db.getProjectRepository.fetchProjectData(parseInt(projectId));
	return res.json(projectData);
};
