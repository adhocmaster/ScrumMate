import express from "express";
import { AppDataSource, Database } from "../data-source";
import { User } from "../entity/User";
import { UserRole } from "../entity/roles";

export const createRole = async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance()
  	const { userId, sprintId } = req.params
	const {
		role,
	} = req.body
	const newRole = await db.createNewRole(parseInt(userId), parseInt(sprintId), role)
	return res.json(newRole);
};

export const editRole = async (req: express.Request, res: express.Response) => {
	const db = Database.getInstance()
	const { roleId, userId } = req.params
	const {
		role,
	} = req.body
	const userRole = await db.updateRole(parseInt(roleId), parseInt(userId), role)
	return res.json(userRole)
};