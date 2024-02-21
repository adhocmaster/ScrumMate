import express from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { UserRole } from "../entity/roles";
import { Sprint } from "../entity/sprint";

const createRoleRouter = express.Router()
// TODO: arent roles only for sprints? not for anything else? 
createRoleRouter.post('/api/role/create/user/:userId/sprint/:sprintId', async (req, res) => {
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
	sprint.addRole(newRole) // may break without relations

	await AppDataSource.manager.save(newRole)
	await AppDataSource.manager.save(sprint)
	return res.json(newRole)
})



/// userId can be optional here
const editRoleRouter = express.Router()
editRoleRouter.post('/api/role/:roleId/edit/:userId', async (req, res) => {
	const { roleId, userId } = req.params
	const userRole = await AppDataSource.manager.findOneBy(UserRole, {id: parseInt(userId)})
	const user = await AppDataSource.manager.findOneBy(User, {id: parseInt(userId)})
	const {
		role,
	} = req.body

	userRole.role = role ?? userRole.role
	userRole.user = user ?? userRole.user // may break if relational not loaded

	await AppDataSource.manager.save(user)
	return res.json(user)
})



export {
	createRoleRouter as createRoleRouter,
	editRoleRouter as editRoleRouter,
}
