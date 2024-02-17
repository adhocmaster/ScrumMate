import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, ManyToMany, CreateDateColumn, UpdateDateColumn, JoinTable, TableInheritance, ChildEntity } from "typeorm"
import { Sprint } from "./sprint"
import { Release } from "./release"
import { User } from "./User"

export enum Priority {
	MUST = 4,
	SHOULD = 3,
	COULD = 2,
	WONT = 1,
	UNPRIORITIZED = 0
}

@Entity()
@TableInheritance({ column: { type: "varchar", name: "type" } })
export class TodoItem {

    @PrimaryGeneratedColumn()
    id: number

	@CreateDateColumn()
	createdDate: Date

	@UpdateDateColumn()
	updatedDate: Date

	@ManyToMany(() => User, (user) => user.assignments)
	@JoinTable()
	assignees: User[]

	@ManyToOne(() => Release, (release) => release.backlog) // have this whether it is in a backlog or not?
	release: Release[]

	// deviating from diagram: each todo item should only be in one backlog.
	// if you need it in another sprint (eg. did not finish it this sprint and want to move it to next), copy it
	// this way if you edit it in the new one, we don't change it in the previous sprints
	// also, work in a sprint should be completed within that sprint.
	@ManyToOne(() => Sprint, (story) => story.stories)
	sprint?: Sprint[] // nullable in case it is just in the backlog

}

// How to handle these? display them in anything?
// What fields do they have?
// Maybe just leave this alone for now... we will surely get a US for it soon
@ChildEntity()
export class Epic extends TodoItem {

	@Column()
	userTypes: string

	@Column()
	functionalityDescription: string

	@Column()
	reasoning: string

	@OneToMany(() => Story, (story) => story.epic)
	stories: Story[]

}

@ChildEntity()
export class Story extends TodoItem {

	@Column()
	userTypes: string

	@Column()
	functionalityDescription: string

	@Column()
	reasoning: string

	@Column()
	acceptanceCriteria: string

	@Column()
	storyPoints: number

	@Column({
		type: "enum",
		enum: Priority,
		default: Priority.UNPRIORITIZED
	})
	priority: Priority

	@ManyToOne(() => Epic, (epic) => epic.stories)
	epic?: Epic
	
	@OneToMany(() => Task, (task) => task.story)
	tasks: Task[]

}

@ChildEntity()
export class Task extends TodoItem {

	@Column()
    description: string

	@Column()
    idealHours: number // may need to specify float?

	@ManyToOne(() => Story, (story) => story.tasks) // for tasks only
	story: Story

}

@ChildEntity()
export class Spike extends TodoItem {

	@Column()
	description: string
	
}

@ChildEntity()
export class Infrastructure extends TodoItem {

	@Column()
	description: string

}

@ChildEntity()
export class Bug extends TodoItem {

	@Column()
	description: string

}
