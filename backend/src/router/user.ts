import express from "express";
import {createUser} from '../controllers/user';

export default (router:express.Router) =>{
  router.post('/user/create', createUser);
  router.post('/user/login', login);
  router.post('user/:userId/edit', edit);
};



createUserRouter.post('/api/user/login', async (req, res) => {
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
});

const editUserRouter = express.Router()
editUserRouter.post('/api/user/:userId/edit', async (req, res) => {
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
