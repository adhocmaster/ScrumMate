import { UserDataSourceWrapper } from "db/dataSourceWrappers/userDataSourceWrapper";
import { Project } from "../../entity/project";
import { ReleaseDataSourceWrapper } from "../dataSourceWrappers/releaseDataSourceWrapper";
import { BacklogItemDataSourceWrapper } from "../dataSourceWrappers/backlogItemDataSourceWrapper";
import { ProjectDataSourceWrapper } from "../dataSourceWrappers/projectDataSourceWrapper";
import { UserRoleDataSourceWrapper } from "../dataSourceWrappers/roleDataSourceWrapper";
import { SprintDataSourceWrapper } from "../dataSourceWrappers/sprintDataSourceWrapper";
import { ModelDataSourceWrapper } from "../dataSourceWrappers/modelDataSourceWrapper";

export class ModelRepository {
	userSource: UserDataSourceWrapper;
	projectSource: ProjectDataSourceWrapper;
	releaseSource: ReleaseDataSourceWrapper;
	sprintSource: SprintDataSourceWrapper;
	roleSource: UserRoleDataSourceWrapper;
	backlogSource: BacklogItemDataSourceWrapper;

	constructor (dataSources: Map<String, ModelDataSourceWrapper>) {
		this.userSource = dataSources.get('user') as UserDataSourceWrapper;
		this.projectSource = dataSources.get('project') as ProjectDataSourceWrapper;
		this.releaseSource = dataSources.get('release') as ReleaseDataSourceWrapper;
		this.sprintSource = dataSources.get('sprint') as SprintDataSourceWrapper;
		this.roleSource = dataSources.get('role') as UserRoleDataSourceWrapper;
		this.backlogSource = dataSources.get('backlog') as BacklogItemDataSourceWrapper;
	}

}