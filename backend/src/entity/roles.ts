import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from "typeorm"
import { Sprint } from "./sprint"
import { Project } from "./project"
import { User } from "./User"

@Entity()
export class UserRole {

    @PrimaryGeneratedColumn()
    id: number
	
	@Column()
	role: string
	
	///// Relational /////

	@OneToOne(() => User)
	@JoinColumn()
	user: User
	
	@ManyToOne(() => Sprint, (sprint) => sprint.roles)
	sprint: Sprint

	@ManyToOne(() => Project, (project) => project.roles)
	project: Project
	
	///// Methods /////
	
	// TODO
}
