import express from "express";
import { Release} from "../entity/release";
import {Project} from '../entity/project';
import { AppDataSource } from "../data-source";


const router = express.Router()

router.post('/api/release/:projectId', async (req, res) => {
  const {projectId} = req.params;
  const projectIdNum = parseInt(projectId);
  if(!projectIdNum) return res.sendStatus(400);

  const project = await AppDataSource.manager.find(Project, {where: {id: projectIdNum}});
  if(project.length == 0) return res.sendStatus(404);

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
  release.project = project[0];

  console.log(release.project);

	await AppDataSource.manager.save(release)
	return res.json(release)
})

// router.get('/api/releases', async (req, res) => {
//   // const {projectId} = req.params;
//   return res.status(200);
// });


//const releaseRepository = AppDataSource.getRepository(Release);

router.post('/api/release/copy/:releaseId', async (req, res) => {
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
	router as createReleaseRouter
}