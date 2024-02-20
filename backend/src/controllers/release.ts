import express from "express";
import { Release } from "../entity/release";
import { AppDataSource } from "../data-source";
import { Project } from "../entity/project";

const router = express.Router()

router.post('/api/release', async (req, res) => {
	const {
		revision,
		revisionDate,
		problemStatement,
		goalStatement,
		projID,
		// sprints,
		// backlog
	} = req.body

	const release = new Release()
	release.revision = revision
	release.revisionDate = revisionDate
	release.problemStatement = problemStatement
	release.goalStatement = goalStatement
	// release.project = project
	// release.sprints = sprints
	// release.backlog = backlog

	const project = await AppDataSource.manager.findOneBy(Project, { id: projID })

	release.project = project

	console.log("I am here")
	console.log(projID)
	console.log(project)
	await AppDataSource.manager.save(release)
	return res.json(release)
})

export {
	router as fetchReleaseVersions
}