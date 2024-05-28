import { Release } from "../../entity/release";
import { NotFoundError } from "../../helpers/errors";
import { ModelDataSourceWrapper } from "./modelDataSourceWrapper";

export class ReleaseDataSourceWrapper extends ModelDataSourceWrapper {

	public async lookupReleaseById(id: number): Promise<Release> {
		const maybeRelease = await this.dataSource.manager.findOneBy(Release, { id: id });
		if (!maybeRelease) {
			throw new NotFoundError(`Release with id ${id} not found`)
		}
		return maybeRelease
	}

	public async lookupReleaseByIdWithRelations(
		releaseId: number,
		includedRelations: {
			includeProject?: boolean,
			includeSprints?: boolean | { todos: boolean },
			includeSignatures?: boolean,
			includeBacklog?: boolean,
			includeDeletedBacklog?: boolean,
		}
	): Promise<Release> {
		const release = await this.dataSource.getRepository(Release).find({
			where: { id: releaseId },
			relations: {
				project: includedRelations.includeProject,
				sprints: includedRelations.includeSprints,
				signatures: includedRelations.includeSignatures,
				backlog: includedRelations.includeBacklog,
				deletedBacklog: includedRelations.includeDeletedBacklog,
			},
		});
		if (!release || release.length === 0) {
			throw new NotFoundError(`Release with releaseId ${releaseId} not found`);
		}
		return release[0];
	}

	public async fetchReleaseWithProject(releaseId: number): Promise<Release> {
		const relations = {
			includeProject: true,
		};
		return await this.lookupReleaseByIdWithRelations(releaseId, relations);
	}

	public async fetchReleaseWithSprints(releaseId: number): Promise<Release> {
		const relations = {
			includeSprints: { todos: true }
		}
		const release = await this.lookupReleaseByIdWithRelations(releaseId, relations);
		release.sortSprints();
		return release;
	}

	public async fetchReleaseWithBacklog(releaseId: number): Promise<Release> {
		const relations = {
			includeBacklog: true,
			includeSprints: { todos: true }
		};
		const release = await this.lookupReleaseByIdWithRelations(releaseId, relations);
		release.sortBacklog();
		return release;
	}

	public async fetchReleaseWithSignatures(releaseId: number): Promise<Release> {
		const relations = {
			includeSignatures: true,
		};
		return await this.lookupReleaseByIdWithRelations(releaseId, relations);
	}

	public async fetchReleaseWithEverything(releaseId: number): Promise<Release> {
		const relations = {
			includeProject: true,
			includeSprints: { todos: true },
			includeSignatures: true,
			includeBacklog: true,
			includeDeletedBacklog: true,
		};
		return await this.lookupReleaseByIdWithRelations(releaseId, relations);
	}

	public async deleteRelease(releaseId: number) {
		await super.delete(Release, releaseId);
	}

}