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
	} = req.body

	const release = new Release()
	release.revision = revision
	release.revisionDate = revisionDate
	release.problemStatement = problemStatement
	release.goalStatement = goalStatement

	await AppDataSource.manager.save(release)
	return res.json(release)
})


//const releaseRepository = AppDataSource.getRepository(Release);

router.post('/api/release/copy/:releaseId', async (req, res) => {
  const {releaseId} = req.params;
  const releaseIdNum = parseInt(releaseId);
  if(!releaseIdNum) res.sendStatus(400);

  const release = await AppDataSource.manager.find(Release, {where: {id: releaseIdNum}});
  if(release.length == 0) res.sendStatus(404);
  // await AppDataSource.manager.transaction(async (transactionalEntityManager) => {
  //   const releases = await transactionalEntityManager.find(Release, {where: id})
  //   await transactionalEntityManager.save(photos)
  //   // ...
  // })

  const releaseCopy = new Release();
  releaseCopy.copy(release[0]);
  await AppDataSource.manager.save(Release, releaseCopy);
  res.json(releaseCopy);
});

export {
	router as createReleaseRouter
}