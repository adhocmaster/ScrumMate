import express from "express";
import { authentication, random } from "../helpers/index";
import { Database } from "../data-source";
import { verifyParameters } from './utils/verifyParams';
import { ExistingUserError, NotFoundError } from "../helpers/errors";

export const createUser = async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance()
	const {
		username,
		email,
		password,
	} = req.body
	if(!verifyParameters(username, email, password)) return res.sendStatus(400);
	try {
		const newUser = await db.createNewUser(username, email, password)
		return res.json(newUser);
	} catch (err) {
		if (err instanceof ExistingUserError) {
			res.sendStatus(400)
		} else {
			res.sendStatus(500)
		}
	}
};

export const login = async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance()
	const {
			email,
			password,
		} = req.body
	if(!verifyParameters(email, password)) return res.sendStatus(400);
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
	try {
		const user = await db.updateUser(parseInt(userId), username, email, password, salt, sessionToken)
		return res.json(user)
	} catch (err) {
		if (err instanceof NotFoundError) {
			return res.sendStatus(404)
		} else {
			return res.sendStatus(500)
		}
	}
};