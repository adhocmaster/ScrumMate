import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm"
import { Sprint } from "./sprint"
import { Project } from "./project"
import { TodoItem } from "./todo"

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

	@OneToMany(() => Sprint, (sprint) => sprint.release)
	sprints: Sprint[]

	@ManyToOne(() => Project, (project) => project.releases)
	project: Project
	
	@OneToMany(() => TodoItem, (todo) => todo.release)
	backlog: TodoItem[]
	
}
