import express from "express";
import { authentication, random } from "../helpers/index";
import { Database } from "../data-source";


export const createUser = async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance()
	const {
		username,
		email,
		password,
	} = req.body

	if(!username || !password || !email) return res.sendStatus(400);
	
	try {
		const newUser = await db.createNewUser(username, email, password)
		return res.json(newUser);
	} catch {
		return res.sendStatus(400)
	}

};

export const login = async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance()
	const {
			email,
			password,
		} = req.body
	if(!email || !password) return res.sendStatus(400);

	try {
		const user = await db.lookupUserByEmail(email);
		const expectedHash = authentication(user.salt, password);
		if(expectedHash !== user.password) return res.sendStatus(403);

		const newSalt = random();
		user.salt = newSalt;
		user.sessionToken = authentication(newSalt, user.username);

		await db.save(user);

		res.cookie('user-auth', user.sessionToken, { domain: "localhost", path: "/" });
		return res.sendStatus(200);
	} catch {
		return res.sendStatus(404);
	}
};

export const edit = async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance()
	const { userId } = req.params
	const {
		username,
		email,
		password,
		salt,
		sessionToken
	} = req.body

	const user = await db.updateUser(parseInt(userId), username, email, password, salt, sessionToken)

	return res.json(user)
};