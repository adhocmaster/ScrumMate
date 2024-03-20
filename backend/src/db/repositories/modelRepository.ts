import { UserDataSourceWrapper } from "db/dataSourceWrappers/userDataSourceWrapper";
import { Project } from "../../entity/project";
import { ReleaseDataSourceWrapper } from "../dataSourceWrappers/releaseDataSourceWrapper";
import { BacklogItemDataSourceWrapper } from "../dataSourceWrappers/backlogItemDataSourceWrapper";
import { ProjectDataSourceWrapper } from "../dataSourceWrappers/projectDataSourceWrapper";
import { UserRoleDataSourceWrapper } from "../dataSourceWrappers/roleDataSourceWrapper";
import { SprintDataSourceWrapper } from "../dataSourceWrappers/sprintDataSourceWrapper";
import { ModelDataSourceWrapper } from "../dataSourceWrappers/modelDataSourceWrapper";
import { Database } from "../database";
import { BacklogItemRepository } from "./backlogItemRepository";
import { ProjectRepository } from "./projectRepository";
import { ReleaseRepository } from "./releaseRepository";
import { UserRoleRepository } from "./roleRepository";
import { SprintRepository } from "./sprintRepository";
import { UserRepository } from "./userRepository";

export class ModelRepository {
	userSource: UserDataSourceWrapper;
	projectSource: ProjectDataSourceWrapper;
	releaseSource: ReleaseDataSourceWrapper;
	sprintSource: SprintDataSourceWrapper;
	roleSource: UserRoleDataSourceWrapper;
	backlogSource: BacklogItemDataSourceWrapper;

	userRepository: UserRepository;
	projectRepository: ProjectRepository;
	releaseRepository: ReleaseRepository;
	sprintRepository: SprintRepository;
	roleRepository: UserRoleRepository;
	backlogItemRepository: BacklogItemRepository;

	constructor (dataSources: Map<String, ModelDataSourceWrapper>, database: Database) {
		this.userSource = dataSources.get('user') as UserDataSourceWrapper;
		this.projectSource = dataSources.get('project') as ProjectDataSourceWrapper;
		this.releaseSource = dataSources.get('release') as ReleaseDataSourceWrapper;
		this.sprintSource = dataSources.get('sprint') as SprintDataSourceWrapper;
		this.roleSource = dataSources.get('role') as UserRoleDataSourceWrapper;
		this.backlogSource = dataSources.get('backlog') as BacklogItemDataSourceWrapper;
		
		this.userRepository = database.getUserRepository;
		this.projectRepository = database.getProjectRepository;
		this.releaseRepository = database.getReleaseRepository;
		this.sprintRepository = database.getSprintRepository;
		this.roleRepository = database.getUserRoleRepository;
		this.backlogItemRepository = database.getBacklogItemRepository;
	}

}