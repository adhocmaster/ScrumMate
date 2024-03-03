import { User } from "../../entity/User";
import { Project } from "../../entity/project";
import { authentication, random } from "../../helpers";
import { ExistingUserError } from "../../helpers/errors";
import { DataSourceWrapper } from "../dataSourceWrapper";

export class UserRepository {
	dataSource: DataSourceWrapper

	constructor (dataSource: DataSourceWrapper) {
		this.dataSource = dataSource
	}

	public async createNewUser(username: string, email: string, password: string, salt?: string, sessionToken?: string): Promise<User> {
		const newUser = new User()
		newUser.username = username
		newUser.email = email
		newUser.salt = salt ?? random();
		newUser.password = authentication(newUser.salt, password);
		try {
			await this.dataSource.save(newUser)
		} catch {
			throw new ExistingUserError("Likely found a duplicate username or email")
		}
		delete newUser.password;
		return newUser
	}

	public async updateUser(id: number, username?: string, email?: string, password?: string, salt?: string, sessionToken?: string): Promise<User> {
		const user = await this.dataSource.lookupUserById(id)
		user.username = username ?? user.username
		user.email = email ?? user.email
		user.password = password ?? user.password
		user.salt = salt ?? user.salt
		user.sessionToken = sessionToken ?? user.sessionToken
		await this.dataSource.save(user)
		return user
	}

	public async joinProject(userId: number, projectId: number): Promise<Project> {
		const user = await this.dataSource.lookupUserById(userId)
		const project = await this.dataSource.lookupProjectById(projectId)
		user.addJoinedProject(project)
		project.addTeamMember(user)
		await this.dataSource.save(user)
		await this.dataSource.save(project)
		return project
	}
}