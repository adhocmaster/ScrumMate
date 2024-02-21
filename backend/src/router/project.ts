import express from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { Project } from "../entity/project";

const createNewProjectRouter = express.Router()

createNewProjectRouter.post('/api/user/:userId/newProject', async (req, res) => {
	const { userId } = req.params
	const user = await AppDataSource.manager.findOneBy(User, {id: parseInt(userId)})

	const {
		name,
	} = req.body

	const newProject = new Project()
	newProject.name = name
	newProject.productOwner = user

	user.addOwnedProject(newProject)

	await AppDataSource.manager.save(user)
	await AppDataSource.manager.save(newProject)
	
	return res.json(newProject)
})

const joinProjectRouter = express.Router()

joinProjectRouter.post('/api/user/:userId/joinProject/:projectId', async (req, res) => {
	const { userId, projectId } = req.params
	const user = await AppDataSource.manager.findOneBy(User, {id: parseInt(userId)})
	const project = await AppDataSource.manager.findOneBy(Project, {id: parseInt(projectId)})

	user.addJoinedProject(project)
	project.addTeamMember(user)

	await AppDataSource.manager.save(user)
	await AppDataSource.manager.save(project)
	
	return res.json(project)
})

const editProject = express.Router()

editProject.post('/api/project/:projectId/edit', async (req, res) => {
	const { projectId } = req.params
	const project = await AppDataSource.manager.findOneBy(Project, {id: parseInt(projectId)})

	const {
		name,
	} = req.body

	project.name = name ?? project.name

	await AppDataSource.manager.save(project)
	
	return res.json(project)
})

export {
	createNewProjectRouter as createNewProjectRouter,
	joinProjectRouter as joinProjectRouter,
	editProject as editProject,
}
