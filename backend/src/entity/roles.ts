import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm"
import { Sprint } from "./sprint"
import { Project } from "./project"
import { User } from "./User"
import { TodoItem } from "./todo"

@Entity()
export class ProjectUserRoles {

    @PrimaryGeneratedColumn()
    id: number

	@Column()
	userToRole: Map<User, string>

	@OneToMany(() => Sprint, (sprint) => sprint.release)
	sprints: Sprint[]

	@ManyToOne(() => Project, (project) => project.roles)
	project?: Project

	@ManyToOne(() => TodoItem, (todo) => todo.roles)
	todoItem?: TodoItem
}
