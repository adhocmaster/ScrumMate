import { UserRole } from "../../entity/roles";
import { DataSourceWrapper } from "../dataSourceWrapper";

export class UserRoleRepository {
	dataSource: DataSourceWrapper

	constructor (dataSource: DataSourceWrapper) {
		this.dataSource = dataSource
	}

	public async createNewRole(userId: number, sprintId: number, role: string): Promise<UserRole> {
		const user = await this.dataSource.lookupUserById(userId)
		const sprint = await this.dataSource.lookupSprintById(sprintId)
		const newRole = new UserRole()
		newRole.role = role
		newRole.user = user
		newRole.sprint = sprint
		await this.dataSource.save(newRole)
		return newRole
	}

	public async updateRole(roleId: number, userId: number, role?: string): Promise<UserRole> {
		const userRole = await this.dataSource.lookupRoleById(roleId)
		const user = await this.dataSource.lookupUserById(userId)
		userRole.role = role ?? userRole.role
		userRole.user = user ?? userRole.user // may break if relational not loaded?
		await this.dataSource.save(userRole)
		return userRole
	}

}