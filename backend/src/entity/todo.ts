import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, ManyToMany, CreateDateColumn, UpdateDateColumn, JoinTable } from "typeorm"
import { Sprint } from "./sprint"
import { Release } from "./release"
import { ProjectUserRoles } from "./roles"
import { inherits } from "util"
import { User } from "./User"

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

	@ManyToOne(() => Release, (release) => release.backlog)
	release: Release[]

	@OneToMany(() => ProjectUserRoles, (role) => role.todoItem)
	roles?: ProjectUserRoles[]

	@OneToMany(() => TodoItem, (todo) => todo.story)
	tasks?: TodoItem[]

	@ManyToOne(() => TodoItem, (todo) => todo.tasks)
	story: TodoItem
	
	@ManyToMany(() => Sprint, (story) => story.stories)
	sprint: Sprint[]
}

@Entity()
export class Story extends TodoItem {
	userTypes: string

	functionalityDescription: string

	reasoning: string

	acceptanceCriteria: string

	storyPoints: number

	priority: number
}
