import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, OneToMany, JoinColumn, CreateDateColumn, ManyToMany, JoinTable } from "typeorm"
import { User } from "./User"
import { Release } from "./release"
import { TodoItem } from "./todo"
import { UserRole } from "./roles"
import { getMaybeUndefined, addMaybeUndefined, removeMaybeUndefined } from "./utils/addGetList"

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

	get sprintDuration(): number {
		var diff = this.startDate.getTime() - this.endDate.getTime()
		return Math.ceil(diff / (1000 * 3600 * 24)); 
	}

	@CreateDateColumn() // automatically set :D
	createdDate: Date
	
	@Column()
	goal: string

	///// Relational /////

	@OneToOne(() => User)
	@JoinColumn()
	scrumMaster: User
	
	@ManyToOne(() => Release, (release) => release.sprints)
	release: Release
	
	@OneToMany(() => TodoItem, (todo) => todo.sprint)
	todos: TodoItem[]

	@OneToMany(() => UserRole, (role) => role.sprint)
	roles: UserRole[]

	///// Methods /////
	
	getRoles(): UserRole[] {
        return getMaybeUndefined(this.roles);
    }
    addRole(role: UserRole): void {
        this.roles = addMaybeUndefined(role, this.roles);
    }
    removeRole(role: UserRole): void {
        this.roles = removeMaybeUndefined(role, this.roles);
    }

    getTODOs(): TodoItem[] {
        return getMaybeUndefined(this.todos);
    }
    addTODO(story: TodoItem): void {
        this.todos = addMaybeUndefined(story, this.todos);
    }
    removeTODO(story: TodoItem): void {
        this.todos = removeMaybeUndefined(story, this.todos);
    }

}
