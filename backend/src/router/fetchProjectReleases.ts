import express from "express";
import { Release } from "../entity/release";
import { AppDataSource } from "../data-source";
import { Project } from "../entity/project";

const router = express.Router()

router.get('/api/project/:projectId', async (req, res) => {
	const { projectId } = req.params

	const projectRepository = await AppDataSource.getRepository(Project)
	const project = await projectRepository.createQueryBuilder("project")
		.where("project.id = :projectId", {projectId: projectId})
		.select(['project.id', 'release.revision', "release.revisionDate"])
		.leftJoin('project.releases', 'release')  // releases is the joined table
		.getMany();
	// const project = await projectRepository.findOne({where: {id: parseInt(projectId)}, relations: ['releases']})

	// console.log(project)
	// console.log(project[0])
	// console.log(project[0].releases)

	return res.json(project[0].releases)
});

router.post('/api/project', async (req, res) => {
  const {
    name
  } = req.body;

  if(!name) return res.sendStatus(400);
  const project = new Project();
  project.name = name;
  await AppDataSource.manager.save(Project, project);
  return res.json(project);
});

export {
	router as fetchProjectReleases
}