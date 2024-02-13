import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm"
import { Release } from "./release"
import { Sprint } from "./sprint"
import { Task } from "./task"

// Stores the information such as Release 1.0.0, Revision 1
@Entity()
export class Story {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    userTypes: string

    @Column()
    functionalityDescription: string

    @Column()
    reasoning: string

	@ManyToOne(() => Release, (release) => release.backlog)
	release: Release

	@ManyToOne(() => Sprint, (sprint) => sprint.stories)
	sprint: Sprint

	@OneToMany(() => Task, (task) => task.story)
	tasks: Task[]
}
