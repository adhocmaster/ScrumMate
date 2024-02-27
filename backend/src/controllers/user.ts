import express from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { authentication, random } from "../helpers/index";

export const createUser = async (req: express.Request, res: express.Response) => {
	const {
		username,
		email,
		password,
	} = req.body

	if(!username || !password || !email) return res.sendStatus(400);
	
	const user = await AppDataSource.manager.findOneBy(User, {email: email});
	if(user) return res.sendStatus(400); // can use the unique: true flag in the entity

	const newUser = new User()
	newUser.username = username
	newUser.email = email
  	newUser.salt = random();
	newUser.password = authentication(newUser.salt, password);

	await AppDataSource.manager.save(newUser)

  	delete newUser.password;

	return res.json(newUser);
};

export const login = async (req: express.Request, res: express.Response) => {
  const {
		email,
		password,
	} = req.body
  if(!email || !password) return res.sendStatus(400);

  const user = await AppDataSource.manager.findOneBy(User, {email: email});
  if(!user) return res.sendStatus(404);

  const expectedHash = authentication(user.salt, password);

  if(expectedHash !== user.password) return res.sendStatus(403);

  const newSalt = random();
  user.salt = newSalt;
  user.sessionToken = authentication(newSalt, user.username);
  await AppDataSource.manager.save(User, user);
  res.cookie('user-auth', user.sessionToken, { domain: "localhost", path: "/" });
  return res.sendStatus(200);
};

export const edit = async (req: express.Request, res: express.Response) => {
	const { userId } = req.params
	const user = await AppDataSource.manager.findOneBy(User, {id: parseInt(userId)})
	const {
		username,
		email,
		password,
		salt,
		sessionToken
	} = req.body

	user.username = username ?? user.username
	user.email = email ?? user.email
	user.password = password ?? user.password
	user.salt = salt ?? user.salt
	user.sessionToken = sessionToken ?? user.sessionToken

	await AppDataSource.manager.save(user)
	return res.json(user)
};