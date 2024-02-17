import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, OneToMany, JoinColumn, CreateDateColumn, ManyToMany, JoinTable } from "typeorm"
import { User } from "./User"
import { Release } from "./release"
import { TodoItem } from "./todo"
import { ProjectUserRoles } from "./roles"

@Entity()
export class Sprint {

    @PrimaryGeneratedColumn()
    id: number

	@Column()
	sprintNumber: number

	@Column()
	startDate: Date

	@Column()
	endDate: Date

	@CreateDateColumn() // automatically set :D
	createdDate: Date
	
	@Column()
	goal: string

	@ManyToOne(() => Release, (release) => release.sprints)
	release: Release[]

    @OneToOne(() => User)
	@JoinColumn()
    scrumMaster: User

	@OneToMany(() => ProjectUserRoles, (role) => role.sprints)
	roles?: ProjectUserRoles[]
	
	@OneToMany(() => TodoItem, (todo) => todo.sprint)
	stories: TodoItem[]

	get sprintDuration(): number {
		var diff = this.startDate.getTime() - this.endDate.getTime()
		return Math.ceil(diff / (1000 * 3600 * 24)); 
	}

}
