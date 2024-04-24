import { BacklogItem, Story } from "../../entity/backlogItem";
import { ModelDataSourceWrapper } from "./modelDataSourceWrapper";
import { NotFoundError } from "../../helpers/errors";
import { assert } from "console";
import { DeleteResult } from "typeorm";

export class BacklogItemDataSourceWrapper extends ModelDataSourceWrapper {

	// TODO: more methods for stories, tasks, etc
	// Some details TBD because of sponsor saying avoid duplication of data

	public async lookupBacklogById(backlogId: number): Promise<BacklogItem> {
		const maybeBacklog = await this.dataSource.manager.findOneBy(BacklogItem, { id: backlogId });
		if (!maybeBacklog) {
			throw new NotFoundError(`BacklogItem with backlogId ${backlogId} not found`)
		}
		return maybeBacklog
	}

	public async lookupStoryById(backlogId: number): Promise<Story> {
		const maybeStory = (await this.lookupBacklogById(backlogId));
		if (!(maybeStory instanceof Story)) {
			throw new NotFoundError(`Story with backlogId ${backlogId} not found`)
		}
		return maybeStory;
	}

	public async fetchBacklogWithParent(backlogId: number): Promise<BacklogItem> {
		const backlogItemWithParents = await this.dataSource.getRepository(BacklogItem).find({
			where: { id: backlogId },
			relations: {
				sprint: true,
				release: true,
			},
		})
		if (!backlogItemWithParents || backlogItemWithParents.length === 0) {
			throw new NotFoundError(`BacklogItem with backlogId ${backlogId} not found`)
		}
		assert(
			(!backlogItemWithParents[0].sprint && backlogItemWithParents[0].release)
			|| (backlogItemWithParents[0].sprint && !backlogItemWithParents[0].release),
			"assertion fail: Backlog item has sprint and release parent"
		);
		return backlogItemWithParents[0]
	}

	public async deleteBacklogItem(backlogId: number): Promise<DeleteResult> {
		return await this.dataSource
			.createQueryBuilder()
			.delete()
			.from(BacklogItem)
			.where("id = :id", { id: backlogId })
			.execute()
	}

}