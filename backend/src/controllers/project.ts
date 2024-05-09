import express from 'express';
import { Database } from "../db/database";
import { verifyParameters } from './utils/verifyParams';

//User id param
export const newProject = async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance();
	const { name } = req.body;
	verifyParameters(name);
	const newProject = await db.getProjectRepository.createNewProject(req.userId, name);
	return res.json(newProject);
};

export const forceJoinProject = async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance();
	const { projectId } = req.params;
	verifyParameters(projectId);
	const project = await db.getUserRepository.forceJoinProject(req.userId, parseInt(projectId));
	return res.json(project);
};

export const editProject = async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance();
	const { projectId } = req.params;
	const { name } = req.body;
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

export const getMembers = async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance();
	const { projectId } = req.params;
	const memberList = await db.getProjectRepository.lookupProjectMembers(parseInt(projectId));
	return res.json(memberList);
};

export const removeMember = async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance();
	const { projectId, memberId } = req.params;
	verifyParameters(projectId, memberId);
	const memberList = await db.getProjectRepository.removeProjectMember(parseInt(projectId), parseInt(memberId));
	return res.json(memberList);
};

export const sendInvite = async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance();
	const { projectId, userEmail } = req.params;
	const newMemberList = await db.getProjectRepository.inviteUser(parseInt(projectId), userEmail);
	return res.json(newMemberList);
};

export const cancelInvite = async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance();
	const { projectId, userId } = req.params;
	const newMemberList = await db.getProjectRepository.cancelInvite(parseInt(projectId), parseInt(userId));
	return res.json(newMemberList);
};

export const leaveProject = async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance();
	const { projectId } = req.params;
	await db.getProjectRepository.leaveProject(req.userId, parseInt(projectId));
	return res.sendStatus(200);
};
