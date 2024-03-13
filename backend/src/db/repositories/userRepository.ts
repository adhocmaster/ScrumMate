import { User } from "../../entity/User";
import { Project } from "../../entity/project";
import { authentication, random } from "../../helpers";
import { ExistingUserError } from "../../helpers/errors";
import { ModelRepository } from "./modelRepository";

export class UserRepository extends ModelRepository {

	public async createNewUser(username: string, email: string, password: string, salt?: string, sessionToken?: string): Promise<User> {
		const newUser = new User()
		newUser.username = username
		newUser.email = email
		newUser.salt = salt ?? random();
		newUser.password = authentication(newUser.salt, password);
		try {
			await this.userSource.save(newUser)
		} catch {
			throw new ExistingUserError("Likely found a duplicate username or email")
		}
		delete newUser.password;
		return newUser
	}

	public async updateUser(id: number, username?: string, email?: string, password?: string, salt?: string, sessionToken?: string): Promise<User> {
		const user = await this.userSource.lookupUserById(id)
		user.username = username ?? user.username
		user.email = email ?? user.email
		user.password = password ?? user.password
		user.salt = salt ?? user.salt
		user.sessionToken = sessionToken ?? user.sessionToken
		await this.userSource.save(user)
		return user
	}

	public async joinProject(userId: number, projectId: number): Promise<Project> {
		const user = await this.userSource.lookupUserById(userId)
		const project = await this.projectSource.lookupProjectById(projectId)
		user.addJoinedProject(project)
		project.addTeamMember(user)
		await this.userSource.save(user)
		await this.projectSource.save(project)
		return project
	}

	public async lookupUserById(id: number) {
		return await this.userSource.lookupUserById(id);
	}

	public async lookupUserByEmail(email: string) {
		return await this.userSource.lookupUserByEmail(email);
	}

	public async lookupUserBySessionToken(sessionToken: string) {
		return await this.userSource.lookupUserBySessionToken(sessionToken);
	}

	public async fetchUserWithProjects(id: number) {
		return await this.userSource.fetchUserWithProjects(id);
	}

}