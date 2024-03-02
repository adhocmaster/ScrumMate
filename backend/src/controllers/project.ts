import express from 'express';
import { Database } from "../data-source";
import { verifyParameters } from './utils/verifyParams';

//User id param
export const newProject =  async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance()
	const {
		name,
    	userId
	} = req.body
	console.log()
  	if(!verifyParameters(name)) return res.sendStatus(400);
	const newProject = await db.createNewProject(userId, name)
	return res.json(newProject)
};

export const joinProject =  async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance()
	const { userId, projectId } = req.params
  	if(!verifyParameters(projectId)) return res.sendStatus(400);
	const project = await db.joinProject(parseInt(userId), parseInt(projectId))
	return res.json(project)
};

export const editProject = async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance()
	const { projectId } = req.params
	const {
		name,
	} = req.body

  	if(!verifyParameters(projectId, name)) return res.sendStatus(400);
	const project = await db.updateProject(parseInt(projectId), name)
	return res.json(project)
};

export const getReleases = async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance()
	const { projectId } = req.params
  	if(!verifyParameters(projectId)) return res.sendStatus(400);
	return res.json(await db.fetchProjectWithReleases(parseInt(projectId)))
};