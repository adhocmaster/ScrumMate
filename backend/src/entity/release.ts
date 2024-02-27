import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm"
import { Sprint } from "./sprint"
import { Project } from "./project"
import { BacklogItem } from "./backlogItem"
import { addMaybeUndefined, getMaybeUndefined, removeMaybeUndefined } from "./utils/addGetList"

@Entity()
export class Release {

    @PrimaryGeneratedColumn()
    id: number

	@Column()
	revision: number

	@Column()
	revisionDate: Date

	@Column()
	problemStatement: string

	@Column()
	goalStatement: string

	///// Relational /////

	@ManyToOne(() => Project, (project) => project.releases, {nullable: false})
	project: Project
	
	@OneToMany(() => Sprint, (sprint) => sprint.release)
	sprints: Sprint[]
	
	@OneToMany(() => BacklogItem, (backlog) => backlog.release)
	backlog: BacklogItem[]

	///// Methods /////
	
	getSprints(): Sprint[] {
		return getMaybeUndefined(this.sprints)
	}
	addSprint(sprint: Sprint): void {
		this.sprints = addMaybeUndefined(sprint, this.sprints)
	}
	removeSprint(sprint: Sprint): void {
		this.sprints = removeMaybeUndefined(sprint, this.sprints)
	}

	getBacklog(): BacklogItem[] {
		return getMaybeUndefined(this.backlog)
	}
	addToBacklog(backlogItem: BacklogItem): void {
		this.backlog = addMaybeUndefined(backlogItem, this.backlog)
	}
	removeFromBacklog(backlogItem: BacklogItem): void {
		this.backlog = removeMaybeUndefined(backlogItem, this.backlog)
	}
  copy(release: Release): void {
    this.revision = release.revision;
    this.problemStatement = release.problemStatement;
    this.goalStatement = release.goalStatement;
    this.revisionDate = release.revisionDate;
    this.project = release.project;
  }
	
}
