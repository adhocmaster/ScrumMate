import express from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { UserRole } from "../entity/roles";
import { Sprint } from "../entity/sprint";

export const createRole = async (req: express.Request, res: express.Response) => {
  const { userId, sprintId } = req.params
	const user = await AppDataSource.manager.findOneBy(User, {id: parseInt(userId)})
	const sprint = await AppDataSource.manager.findOneBy(Sprint, {id: parseInt(sprintId)}) // may need to include relations
	const {
		role,
	} = req.body

	const newRole = new UserRole()
	newRole.role = role
	newRole.user = user
	newRole.sprint = sprint
	// may break without relations? hope it works without this
	// sprint.addRole(newRole)

	await AppDataSource.manager.save(newRole)
	// await AppDataSource.manager.save(sprint)
	return res.json(newRole);
};

export const editRole = async (req: express.Request, res: express.Response) => {
	const { roleId, userId } = req.params
	const userRole = await AppDataSource.manager.findOneBy(UserRole, {id: parseInt(roleId)})
	const user = await AppDataSource.manager.findOneBy(User, {id: parseInt(userId)})
	const {
		role,
	} = req.body

	userRole.role = role ?? userRole.role
	userRole.user = user ?? userRole.user // may break if relational not loaded?

	await AppDataSource.manager.save(userRole)
	return res.json(userRole)
};