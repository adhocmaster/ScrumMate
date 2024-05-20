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

	// Do we even need this? estimates is a Column, not a relation
	public async fetchBacklogWithPoker(backlogId: number): Promise<BacklogItem> {
		const backlogItemWithPoker = await this.dataSource.getRepository(BacklogItem).find({
			where: { id: backlogId },
			relations: {
				estimates: true,
			},
		})
		if (!backlogItemWithPoker || backlogItemWithPoker.length === 0) {
			throw new NotFoundError(`BacklogItem with backlogId ${backlogId} not found`)
		}
		return backlogItemWithPoker[0]
	}

	public async deleteBacklogItem(backlogId: number): Promise<DeleteResult> {
		return await super.delete(BacklogItem, backlogId);
	}

}