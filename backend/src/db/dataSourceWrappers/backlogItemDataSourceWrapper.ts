import { BacklogItem, Story } from "../../entity/backlogItem";
import { ModelDataSourceWrapper } from "./modelDataSourceWrapper";
import { NotFoundError } from "../../helpers/errors";

export class BacklogItemDataSourceWrapper extends ModelDataSourceWrapper {
	
	// TODO: more methods for stories, tasks, etc
	// Some details TBD because of sponsor saying avoid duplication of data

	public async lookupBacklogById(id: number): Promise<BacklogItem> {
		const maybeBacklog =  await this.dataSource.manager.findOneBy(BacklogItem, {id: id});
		if (!maybeBacklog) {
			throw new NotFoundError(`BacklogItem with id ${id} not found`)
		}
		return maybeBacklog
	}
	
	public async lookupStoryById(id: number): Promise<Story> {
		const maybeStory = (await this.lookupBacklogById(id));
		if (!(maybeStory instanceof Story)) {
			throw new NotFoundError(`Story with id ${id} not found`)
		}
		return maybeStory;
	}

}