import { User } from "../../entity/User";
import { NotFoundError } from "../../helpers/errors";
import { ModelDataSourceWrapper } from "./modelDataSourceWrapper";

export class UserDataSourceWrapper extends ModelDataSourceWrapper {

	public async lookupUserById(id: number): Promise<User> {
		const maybeUser = await this.dataSource.manager.findOneBy(User, { id: id });
		if (!maybeUser) {
			throw new NotFoundError(`User with id ${id} not found`)
		}
		return maybeUser
	}

	public async lookupUserByEmail(email: string): Promise<User> {
		const maybeUser = await this.dataSource.manager.findOneBy(User, { email: email });
		if (!maybeUser) {
			throw new NotFoundError(`User with email ${email} not found`)
		}
		return maybeUser
	}

	public async lookupUserBySessionToken(sessionToken: string): Promise<User> {
		const maybeUser = await this.dataSource.manager.findOneBy(User, { sessionToken: sessionToken });
		if (!maybeUser) {
			throw new NotFoundError(`User not found`)
		}
		return maybeUser;
	}

	public async lookupUserByIdWithRelations(
		userId: number,
		includedRelations: {
			includeOwnedProjects?: boolean,
			includeJoinedProjects?: boolean,
			includeProjectInvites?: boolean,
			includeSignedReleases?: boolean,
			includeAssignments?: boolean,
		}
	): Promise<User> {
		const user = await this.dataSource.getRepository(User).find({
			where: { id: userId },
			relations: {
				ownedProjects: includedRelations.includeOwnedProjects,
				joinedProjects: includedRelations.includeJoinedProjects,
				projectInvites: includedRelations.includeProjectInvites,
				signedReleases: includedRelations.includeSignedReleases,
				assignments: includedRelations.includeAssignments,
			},
		});
		if (!user || user.length === 0) {
			throw new NotFoundError(`User with userId ${userId} not found`);
		}
		return user[0];
	}

	public async fetchUserWithProjects(userId: number): Promise<User> {
		const relations = {
			includeOwnedProjects: true,
			includeJoinedProjects: true,
		};
		return await this.lookupUserByIdWithRelations(userId, relations);
	}

	public async fetchUserWithProjectInvites(userId: number): Promise<User> {
		const relations = {
			includeProjectInvites: true,
		};
		return await this.lookupUserByIdWithRelations(userId, relations);
	}

	public async fetchUserByEmailWithProjectInvites(email: string): Promise<User> {
		const maybeUserList = await this.dataSource.getRepository(User).find({
			where: { email: email },
			relations: {
				projectInvites: true
			}
		})
		if (!maybeUserList || maybeUserList.length === 0) {
			throw new NotFoundError(`User with email ${email} not found`)
		}
		// Sometimes its not included ???
		return maybeUserList[0]
	}

}