import express from "express";
import { Release } from "../entity/release";

const router = express.Router()

router.post('/api/release', async (req, res) => {
	const {
		problemStatement,
		goalStatement
	} = req.body

	const release = new Release()
	release.problemStatement = "cant find happiness"
	release.goalStatement = "try to be happiness"

	// await release.

	return res.json(release)
})

export {
	router as fetchReleaseVersions
}