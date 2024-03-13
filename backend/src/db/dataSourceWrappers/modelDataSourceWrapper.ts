import { User } from "../../entity/User";
import { BacklogItem } from "../../entity/backlogItem";
import { Project } from "../../entity/project";
import { Release } from "../../entity/release";
import { UserRole } from "../../entity/roles";
import { Sprint } from "../../entity/sprint";
import { NotSavedError, NotFoundError } from "../../helpers/errors";
import { DataSource, EntityTarget, FindManyOptions, ObjectLiteral } from "typeorm";

export class ModelDataSourceWrapper {
	public dataSource: DataSource;

	public constructor(dataSource: DataSource) {
		this.dataSource = dataSource
	}

	public get dataSourceIsInitialized(): boolean {
		return this.dataSource != null && this.dataSource.isInitialized;
	}
	
	/// Works for any type
	public async save(item: any) {
		try {
			return await this.dataSource.manager.save(item);
		} catch {
			throw new NotSavedError(`Failed to save ${item}`)
		}
	}

	/// Works for any type
	public async find(entity: EntityTarget<ObjectLiteral>, findOptions: FindManyOptions<ObjectLiteral>) {
		const result = await this.dataSource.manager.find(entity, findOptions)
		if (!result) {
			throw new NotFoundError(`Find failed: ${entity} with ${findOptions} not found`)
		}
		return result
	}

	public async lookupById(type: any, id: number) { // issues with type :(
		const maybeItem =  await this.dataSource.manager.findOneBy(type, {id: id});
		if (!maybeItem) {
			throw new NotFoundError(`${type} with id ${id} not found`)
		}
		return maybeItem
	}

	public async nuke(): Promise<void> {
		const loadedReleases = await this.dataSource.getRepository(Release).find({
			relations: ['project', 'sprints', 'backlog'],
		});
		const loadedProjects = await this.dataSource.getRepository(Project).find({
			relations: ['productOwner', 'teamMembers'],
		});
		const loadedUsers = await this.dataSource.getRepository(User).find({
			relations: ['ownedProjects', 'joinedProjects'],
		});
		await this.dataSource.getRepository(UserRole).delete({})
		await this.dataSource.getRepository(BacklogItem).delete({})
		await this.dataSource.getRepository(Sprint).delete({})
		for (const release of loadedReleases) { // many2many hard :(
			delete release.project
			release.sprints = []
			release.backlog = []
			await this.dataSource.manager.save(release)
		}
		await this.dataSource.getRepository(Release).delete({})
		for (const project of loadedProjects) { // many2many hard :(
			project.teamMembers = []
			await this.dataSource.manager.save(project)
		}
		for (const user of loadedUsers) {
			user.ownedProjects = []
			user.joinedProjects = []
			await this.dataSource.manager.save(user)
		}
		await this.dataSource.getRepository(Project).delete({})
		await this.dataSource.getRepository(User).delete({})
	}

	// /// Like save, but guaranteed to not exist in the db
	// /// for performance purposes
	// /// WARNING: behaves differently than save somehow... doesnt save into original entity?
	// public async insert(item: User | Project | Release | UserRole | Sprint | BacklogItem) {
	// 	try {
	// 		return await this.dataSource.manager.insert(typeof(item), item);
	// 	} catch {
	// 		throw new NotSavedError(`Failed to insert ${item}`)
	// 	}
	// }

	// /// Like save, but guaranteed to already exist in the db
	// /// for performance purposes
	// /// WARNING: behaves differently than save somehow...
	// public async update(item: User | Project | Release | UserRole | Sprint | BacklogItem) {
	// 	try {
	// 		return await this.dataSource.manager.update(typeof(item), item.id, item);
	// 	} catch {
	// 		throw new NotSavedError(`Failed to update ${item}`)
	// 	}
	// }

	// public async findBy(entity: EntityTarget<ObjectLiteral>, findWhereOptions: FindOptionsWhere<ObjectLiteral> | FindOptionsWhere<ObjectLiteral>[]) {
	// 	const result = await this.dataSource.manager.findBy(entity, findWhereOptions)
	// 	if (!result) {
	// 		throw new NotFoundError(`FindBy failed: ${entity} with ${findWhereOptions} not found`)
	// 	}
	// 	return result
	// }
}