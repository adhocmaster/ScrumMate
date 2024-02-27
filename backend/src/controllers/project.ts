import express from 'express';
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { Project } from "../entity/project";

//User id param
export const newProject =  async (req: express.Request, res: express.Response) => {
	const { userId } = req.params
	const user = await AppDataSource.manager.findOneBy(User, {id: parseInt(userId)})
	const {
		name,
	} = req.body

	const newProject = new Project()
	newProject.name = name
	newProject.productOwner = user

	user.addOwnedProject(newProject)

	await AppDataSource.manager.save(user)
	await AppDataSource.manager.save(newProject)
	return res.json(newProject)
};

export const joinProject =  async (req: express.Request, res: express.Response) => {
	const { userId, projectId } = req.params
	const user = await AppDataSource.manager.findOneBy(User, {id: parseInt(userId)})
	const project = await AppDataSource.manager.findOneBy(Project, {id: parseInt(projectId)})

	user.addJoinedProject(project)
	project.addTeamMember(user)

	await AppDataSource.manager.save(user)
	await AppDataSource.manager.save(project)
	return res.json(project)
};

export const editProject = async (req: express.Request, res: express.Response) => {
	const { projectId } = req.params
	const project = await AppDataSource.manager.findOneBy(Project, {id: parseInt(projectId)})
	const {
		name,
	} = req.body

	project.name = name ?? project.name

	await AppDataSource.manager.save(project)
	return res.json(project)
};

export const getReleases = async (req: express.Request, res: express.Response) => {
	const { projectId } = req.params

	const projectRepository = AppDataSource.getRepository(Project)
	const project = await projectRepository.createQueryBuilder("project")
		.where("project.id = :projectId", {projectId: projectId})
		.select(['project.id', 'release.revision', "release.revisionDate"])
		.leftJoin('project.releases', 'release')  // releases is the joined table
		.getMany();
	// const project = await projectRepository.findOne({where: {id: parseInt(projectId)}, relations: ['releases']}) // old

	return res.json(project[0].releases)
};

