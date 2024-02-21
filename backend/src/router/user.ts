import express from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

const createUserRouter = express.Router()

createUserRouter.post('/api/user/create', async (req, res) => {
	const {
		username,
		email,
		password,
		salt,
		sessionToken
	} = req.body

	const newUser = new User()
	newUser.username = username
	newUser.email = email
	newUser.password = password
	newUser.salt = salt
	newUser.sessionToken = sessionToken

	await AppDataSource.manager.save(newUser)
	
	return res.json(newUser)
})

const editUserRouter = express.Router()

editUserRouter.post('/api/user/edit/:userId', async (req, res) => {
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
})

export {
	createUserRouter as createUserRouter,
	editUserRouter as editUserRouter,
}
