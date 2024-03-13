import { UserRole } from "../../entity/roles";
import { ModelRepository } from "./modelRepository";

export class UserRoleRepository extends ModelRepository {

	public async createNewRole(userId: number, sprintId: number, role: string): Promise<UserRole> {
		const user = await this.userSource.lookupUserById(userId)
		const sprint = await this.sprintSource.lookupSprintById(sprintId)
		const newRole = new UserRole()
		newRole.role = role
		newRole.user = user
		newRole.sprint = sprint
		await this.roleSource.save(newRole)
		return newRole
	}

	public async updateRole(roleId: number, userId: number, role?: string): Promise<UserRole> {
		const userRole = await this.roleSource.lookupRoleById(roleId)
		const user = await this.userSource.lookupUserById(userId)
		userRole.role = role ?? userRole.role
		userRole.user = user ?? userRole.user // may break if relational not loaded?
		await this.roleSource.save(userRole)
		return userRole
	}

	public async lookupRoleById(id: number): Promise<UserRole> {
		return await this.roleSource.lookupRoleById(id);
	}
}