import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm"
import { Sprint } from "./sprint"
import { Project } from "./project"
import { TodoItem } from "./todo"
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

	@ManyToOne(() => Project, (project) => project.releases)
	project: Project
	
	@OneToMany(() => Sprint, (sprint) => sprint.release)
	sprints: Sprint[]
	
	@OneToMany(() => TodoItem, (todo) => todo.release)
	backlog: TodoItem[]

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
	getBacklog(): TodoItem[] {
		return getMaybeUndefined(this.backlog)
	}
	addToBacklog(todo: TodoItem): void {
		this.backlog = addMaybeUndefined(todo, this.backlog)
	}
	removeFromBacklog(todo: TodoItem): void {
		this.backlog = removeMaybeUndefined(todo, this.backlog)
	}
	
}
