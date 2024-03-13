import express from "express";
import { authentication, random } from "../helpers/index";
import { Database } from "../db/database";
import { verifyParameters } from './utils/verifyParams';

export const createUser = async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance()
	const {
		username,
		email,
		password,
	} = req.body
	if(!verifyParameters(username, email, password)) return res.sendStatus(400);
	const newUser = await db.getUserRepository.createNewUser(username, email, password)
	return res.json(newUser);
};

export const login = async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance()
	const {
			email,
			password,
		} = req.body
	if(!verifyParameters(email, password)) return res.sendStatus(400);
	const user = await db.getUserRepository.lookupUserByEmail(email);
	const expectedHash = authentication(user.salt, password);
	if(expectedHash !== user.password) return res.sendStatus(403);

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
	const db = Database.getInstance()
	if(!verifyParameters(req.userId)) return res.sendStatus(400);
	const userWithProjects = await db.getUserRepository.fetchUserWithProjects(req.userId)
	return res.json([...userWithProjects.getOwnedProjects(), ...userWithProjects.getJoinedProjects()]);
};
