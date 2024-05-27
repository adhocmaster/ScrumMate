import { BacklogItem } from "../../entity/backlogItem";
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
			throw new NotFoundError(`BacklogItem with backlogId ${backlogId} not found`);
		}
		return maybeBacklog;
	}

	public async lookupBacklogByIdWithRelations(
		backlogId: number,
		includedRelations: {
			includeRelease?: boolean,
			includeSprint?: boolean,
			includeDeletedFrom?: boolean,
			includeAssignees?: boolean
		}
	): Promise<BacklogItem> {
		const backlogItem = await this.dataSource.getRepository(BacklogItem).find({
			where: { id: backlogId },
			relations: {
				release: includedRelations.includeRelease,
				sprint: includedRelations.includeSprint,
				deletedFrom: includedRelations.includeDeletedFrom,
				assignees: includedRelations.includeAssignees,
			},
		});
		if (!backlogItem || backlogItem.length === 0) {
			throw new NotFoundError(`BacklogItem with backlogId ${backlogId} not found`);
		}
		return backlogItem[0]
	}

	public async fetchBacklogWithParent(backlogId: number): Promise<BacklogItem> {
		const relationsToInclude = {
			includeRelease: true,
			includeSprint: true,
		};
		const backlogItemWithParents = await this.lookupBacklogByIdWithRelations(backlogId, relationsToInclude);
		assert(
			(!backlogItemWithParents.sprint && backlogItemWithParents.release)
			|| (backlogItemWithParents.sprint && !backlogItemWithParents.release),
			"assertion fail: Backlog item has sprint and release parent"
		);
		return backlogItemWithParents;
	}

	public async deleteBacklogItem(backlogId: number): Promise<DeleteResult> {
		return await super.delete(BacklogItem, backlogId);
	}

}