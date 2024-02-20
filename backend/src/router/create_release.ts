import express from "express";
import { Release } from "../entity/release";
import { AppDataSource } from "../data-source";

const router = express.Router()

router.post('/api/release', async (req, res) => {
	const {
		revision,
		revisionDate,
		problemStatement,
		goalStatement,
		sprints,
		backlog,
	} = req.body

	const release = new Release()
	release.revision = revision
	release.revisionDate = revisionDate
	release.problemStatement = problemStatement
	release.goalStatement = goalStatement
	release.sprints = sprints
	release.backlog = backlog

	await AppDataSource.manager.save(release)
	return res.json(release)
})

export {
	router as createReleaseRouter
}