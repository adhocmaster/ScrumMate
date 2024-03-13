import { User } from "../../entity/User";
import { NotFoundError } from "../../helpers/errors";
import { ModelDataSourceWrapper } from "./modelDataSourceWrapper";

export class UserDataSourceWrapper extends ModelDataSourceWrapper {

	public async lookupUserById(id: number): Promise<User> {
		const maybeUser = await this.dataSource.manager.findOneBy(User, {id: id});
		if (!maybeUser) {
			throw new NotFoundError(`User with id ${id} not found`)
		}
		return maybeUser
	}

	public async lookupUserByEmail(email: string): Promise<User> {
		const maybeUser = await this.dataSource.manager.findOneBy(User, {email: email});
		if (!maybeUser) {
			throw new NotFoundError(`User with email ${email} not found`)
		}
		return maybeUser
	}

	public async lookupUserBySessionToken(sessionToken: string): Promise<User> {
		const maybeUser = await this.dataSource.manager.findOneBy(User, {sessionToken: sessionToken});
			if (!maybeUser) {
				throw new NotFoundError(`User not found`)
			}
			return maybeUser;
	}

	public async fetchUserWithProjects(id: number): Promise<User> {
		const maybeUserList = await this.dataSource.getRepository(User).find({
			where: {id: id},
			relations:{
				ownedProjects: true,
				joinedProjects: true
			}})
		if (!maybeUserList || maybeUserList.length === 0) {
			throw new NotFoundError(`User with id ${id} not found`)
		}
		return maybeUserList[0]
	}

}