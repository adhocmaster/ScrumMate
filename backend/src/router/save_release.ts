import express from "express";
import { Release } from "../entity/release";
import { AppDataSource } from "../data-source";

const router = express.Router()

router.post('/api/release/:releaseId', async (req, res) => {
	const { releaseId } = req.params

	const {
		revision,
		revisionDate,
		problemStatement,
		goalStatement,
	} = req.body

	const releaseRepository = await AppDataSource.getRepository(Release)
	const releaseToUpdate = await releaseRepository.findOneBy({id: parseInt(releaseId)})
	releaseToUpdate.revision = revision ?? releaseToUpdate.revision
	releaseToUpdate.revisionDate = revisionDate ?? releaseToUpdate.revisionDate
	releaseToUpdate.problemStatement = problemStatement ?? releaseToUpdate.problemStatement
	releaseToUpdate.goalStatement = goalStatement ?? releaseToUpdate.goalStatement

	await AppDataSource.manager.save(releaseToUpdate)
	return res.json(releaseToUpdate)
})

export {
	router as saveRelease
}