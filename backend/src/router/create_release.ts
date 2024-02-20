import express from "express";
import { Release } from "../entity/release";
import { AppDataSource } from "../data-source";
import { Project } from "entity/project";

const router = express.Router()

router.post('/api/:projectId/release', async (req, res) => {
	const { projectId } = req.params

	const {
		revision,
		revisionDate,
		problemStatement,
		goalStatement,
	} = req.body

	const release = new Release()
	release.revision = revision
	release.revisionDate = revisionDate
	release.problemStatement = problemStatement
	release.goalStatement = goalStatement

	const project = await AppDataSource.manager.findOneBy(Project, {id: parseInt(projectId)})

	release.project = project 

	await AppDataSource.manager.save(release)

	// Not sure if need to do this too or if automatic
	// project.addRelease(release)
	// await AppDataSource.manager.save(project)
	
	return res.json(release)
})

export {
	router as createRelease
}