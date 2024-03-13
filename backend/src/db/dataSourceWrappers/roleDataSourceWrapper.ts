import { UserRole } from "../../entity/roles";
import { NotFoundError } from "../../helpers/errors";
import { ModelDataSourceWrapper } from "./modelDataSourceWrapper";

export class UserRoleDataSourceWrapper extends ModelDataSourceWrapper {
	
	public async lookupRoleById(id: number): Promise<UserRole> {
		const maybeRole =  await this.dataSource.manager.findOneBy(UserRole, {id: id});
		if (!maybeRole) {
			throw new NotFoundError(`Role with id ${id} not found`)
		}
		return maybeRole
	}

}