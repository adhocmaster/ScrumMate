import express from "express";
import { authentication, random } from "../helpers/index";
import { Database } from "../db/database";
import { verifyParameters } from './utils/verifyParams';

export const createUser = async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance();
	const {
		username,
		email,
		password,
	} = req.body;
	verifyParameters(username, email, password);
	const newUser = await db.getUserRepository.createNewUser(username, email, password);
	return res.json(newUser);
};

export const login = async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance();
	const {
		email,
		password,
	} = req.body;
	verifyParameters(email, password);
	const user = await db.getUserRepository.lookupUserByEmail(email);
	const expectedHash = authentication(user.salt, password);
	if (expectedHash !== user.password) return res.sendStatus(403);

	const newSalt = random();
	user.sessionToken = authentication(newSalt, user.username);

	await db.save(user);

	res.cookie('user-auth', user.sessionToken, { domain: "localhost", path: "/" });
	delete user.password;
	return res.json(user);
};

//TODO
export const edit = async (req: express.Request, res: express.Response) => {
	return res.sendStatus(200);
};
// 	const db = Database.getInstance()
// 	const {
// 		username,
// 		email,
// 		password,
// 	} = req.body
// 	const user = await db.updateUser(parseInt(userId), username, email, password, salt, sessionToken)
// 	return res.json(user)
// };

export const getProjects = async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance();
	verifyParameters(req.userId);
	const userWithProjects = await db.getUserRepository.fetchUserWithProjects(req.userId);
	return res.json([...userWithProjects.getOwnedProjects(), ...userWithProjects.getJoinedProjects()]);
};

export const getProjectRowData = async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance();
	verifyParameters(req.userId);
	const projectData = await db.getUserRepository.fetchUserProjectsRowData(req.userId);
	return res.json(projectData);
};

export const getInvites = async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance();
	verifyParameters(req.userId);
	const user = await db.getUserRepository.fetchUserWithProjectInvites(req.userId);
	return res.json(user.projectInvites);
};

export const acceptInvite = async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance();
	const { projectId } = req.body;
	verifyParameters(req.userId, projectId);
	const user = await db.getUserRepository.acceptInvite(req.userId, parseInt(projectId));
	return res.json(user.projectInvites);
};

export const rejectInvite = async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance();
	const { projectId } = req.body;
	verifyParameters(req.userId, projectId);
	const user = await db.getUserRepository.rejectInvite(req.userId, parseInt(projectId));
	return res.json(user.projectInvites);
};
