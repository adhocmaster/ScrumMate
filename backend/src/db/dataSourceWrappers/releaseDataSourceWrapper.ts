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

	public async fetchReleaseWithProject(releaseId: number): Promise<Release> {
		const releaseWithProject = (await this.dataSource.getRepository(Release).find({
			where: { id: releaseId },
			relations: {
				project: true
			},
		}))
		if (!releaseWithProject || releaseWithProject.length === 0) {
			throw new NotFoundError(`Release with releaseId ${releaseId} not found`)
		}
		return releaseWithProject[0]
	}

	public async fetchReleaseWithSprints(releaseId: number): Promise<Release> {
		const releaseWithSprints = await this.dataSource.getRepository(Release).find({
			where: { id: releaseId },
			relations: {
				sprints: {
					todos: true,
				},
			},
		})
		if (!releaseWithSprints || releaseWithSprints.length === 0) {
			throw new NotFoundError(`Release with releaseId ${releaseId} not found`)
		}
		return releaseWithSprints[0]
	}

	public async fetchReleaseWithBacklog(releaseId: number): Promise<Release> {
		const releaseWithBacklog = await this.dataSource.getRepository(Release).find({
			where: { id: releaseId },
			relations: {
				backlog: true,
				sprints: {
					todos: true,
				}
			},
		})
		if (!releaseWithBacklog || releaseWithBacklog.length === 0) {
			throw new NotFoundError(`Release with releaseId ${releaseId} not found`)
		}
		releaseWithBacklog[0].backlog.sort((a, b) => a.rank - b.rank)
		return releaseWithBacklog[0]
	}

	public async fetchReleaseWithSignatures(releaseId: number): Promise<Release> {
		const releaseWithSignatures = await this.dataSource.getRepository(Release).find({
			where: { id: releaseId },
			relations: {
				signatures: true,
			},
		})
		if (!releaseWithSignatures || releaseWithSignatures.length === 0) {
			throw new NotFoundError(`Release with releaseId ${releaseId} not found`)
		}
		return releaseWithSignatures[0]
	}

	public async fetchReleaseWithEverything(releaseId: number): Promise<Release> {
		const releaseWithSprints = await this.dataSource.getRepository(Release).findOne({
			where: { id: releaseId },
			relations: {
				project: true,
				sprints: {
					todos: true,
				},
				backlog: true,
				deletedBacklog: true,
				signatures: true,
			},
		})
		if (!releaseWithSprints) {
			throw new NotFoundError(`Release with releaseId ${releaseId} not found`)
		}
		return releaseWithSprints
	}

	public async deleteRelease(releaseId: number) {
		await super.delete(Release, releaseId);
	}

}