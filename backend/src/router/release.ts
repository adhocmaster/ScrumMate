import express from "express";
import { Release} from "../entity/release";
import { AppDataSource } from "../data-source";
import { Project } from "../entity/project";

const newReleaseRouter = express.Router()
newReleaseRouter.post('/api/project/:projectId/newRelease', async (req, res) => {
	const { projectId } = req.params
	const project = await AppDataSource.manager.findOneBy(Project, {id: parseInt(projectId)})
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
	release.project = project // do not need to load relations or save the other way

	await AppDataSource.manager.save(release)
	return res.json(release)
})



const editReleaseRouter = express.Router()
editReleaseRouter.post('/api/release/:releaseId/edit', async (req, res) => {
	const { releaseId } = req.params
	const releaseRepository = await AppDataSource.getRepository(Release)
	const releaseToUpdate = await releaseRepository.findOneBy({id: parseInt(releaseId)})

	const {
		revision,
		revisionDate,
		problemStatement,
		goalStatement,
	} = req.body

	releaseToUpdate.revision = revision ?? releaseToUpdate.revision
	releaseToUpdate.revisionDate = revisionDate ?? releaseToUpdate.revisionDate
	releaseToUpdate.problemStatement = problemStatement ?? releaseToUpdate.problemStatement
	releaseToUpdate.goalStatement = goalStatement ?? releaseToUpdate.goalStatement

	await releaseRepository.save(releaseToUpdate)
	return res.json(releaseToUpdate)
})



// TODO: revisit and clean up a bit
const copyReleaseRouter = express.Router()
copyReleaseRouter.post('/api/release/:releaseId/copy', async (req, res) => {
  const {releaseId} = req.params;
  const releaseIdNum = parseInt(releaseId);
  if(!releaseIdNum) return res.sendStatus(400);

  const release = await AppDataSource.manager.createQueryBuilder(Release, "release")
    .leftJoinAndSelect("release.project", "project")
    .where("release.id = :id", { id: releaseIdNum })
    .getMany()

  if(release.length == 0) return res.sendStatus(404);

  const releaseCopy = new Release();
  releaseCopy.copy(release[0]);

  await AppDataSource.manager.transaction(async (transactionalEntityManager) => {
    const releases = await transactionalEntityManager.find(Release,{
      where: {
        project: release[0].project
      },
      order: {id: "DESC"}
    });
    console.log(releases);
    releaseCopy.revision = releases[0].revision + 1;

    await transactionalEntityManager.save(Release, releaseCopy);
  });

  res.json(releaseCopy);
});



export {
	newReleaseRouter as newReleaseRouter,
	editReleaseRouter as editReleaseRouter,
	copyReleaseRouter as copyReleaseRouter,
}
