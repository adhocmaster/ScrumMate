import express from "express";
import { AppDataSource } from "../data-source";
import { Sprint } from "../entity/sprint";
import { Release } from "../entity/release";

const createSprintRouter = express.Router()
createSprintRouter.post('/api/release/:releaseId/sprint/create', async (req, res) => {
	const { releaseId } = req.params
	const release = await AppDataSource.manager.findOneBy(Release, {id: parseInt(releaseId)})
	const {
		sprintNumber,
		startDate,
		endDate,
		createdDate,
		goal,
	} = req.body

	const newSprint = new Sprint()
	newSprint.sprintNumber = sprintNumber
	newSprint.startDate = startDate
	newSprint.endDate = endDate
	newSprint.createdDate = createdDate
	newSprint.goal = goal
	newSprint.release = release
	release.addSprint(newSprint) // not sure if need to do. need to load relation?

	await AppDataSource.manager.save(newSprint)
	// await AppDataSource.manager.save(release)
	return res.json(newSprint)
})



const editSprintRouter = express.Router()
editSprintRouter.post('/api/sprint/:sprintId/edit', async (req, res) => {
	const { sprintId } = req.params
	const sprint = await AppDataSource.manager.findOneBy(Sprint, {id: parseInt(sprintId)})
	const {
		sprintNumber,
		startDate,
		endDate,
		createdDate,
		goal,
	} = req.body

	sprint.sprintNumber = sprintNumber ?? sprint.sprintNumber
	sprint.startDate = startDate ?? sprint.startDate
	sprint.endDate = endDate ?? sprint.endDate
	sprint.createdDate = createdDate ?? sprint.createdDate
	sprint.goal = goal ?? sprint.goal

	await AppDataSource.manager.save(sprint)
	return res.json(sprint)
})



export {
	createSprintRouter as createSprintRouter,
	editSprintRouter as editSprintRouter,
}
