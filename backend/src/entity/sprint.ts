import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, OneToMany, JoinColumn, CreateDateColumn } from "typeorm"
import { User } from "./User"
import { Release } from "./release"
import { BacklogItem } from "./backlogItem"
import { UserRole } from "./roles"
import { getMaybeUndefined, addMaybeUndefined, removeMaybeUndefined } from "./utils/addGetList"

@Entity()
export class Sprint {

	@PrimaryGeneratedColumn()
	id: number

	@Column()
	sprintNumber: number

	@Column({ default: 0 })
	backlogItemCount: number

	@Column({ nullable: true })
	startDate: Date

	@Column({ nullable: true })
	endDate: Date

	get sprintDuration(): number {
		if (!this.startDate || !this.endDate) {
			return null;
		}
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

	@ManyToOne(() => Release, (release) => release.sprints, { nullable: false })
	release: Release

	@OneToMany(() => BacklogItem, (todo) => todo.sprint)
	todos: BacklogItem[]

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

	getTODOs(): BacklogItem[] {
		return getMaybeUndefined(this.todos);
	}
	addTODO(story: BacklogItem): void {
		this.todos = addMaybeUndefined(story, this.todos);
	}
	removeTODO(story: BacklogItem): void {
		this.todos = removeMaybeUndefined(story, this.todos);
	}
	sortTODO(): BacklogItem[] {
		if (this.todos) {
			return this.todos.sort((a: BacklogItem, b: BacklogItem) => a.rank - b.rank);
		}
	}

	copy(sprint: Sprint): void {
		this.sprintNumber = sprint.sprintNumber;
		this.startDate = sprint.startDate;
		this.endDate = sprint.endDate;
		this.createdDate = sprint.createdDate;
		this.goal = sprint.goal;
		this.backlogItemCount = sprint.backlogItemCount;
	}

}
