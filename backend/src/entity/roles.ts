import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm"
import { Sprint } from "./sprint"
import { Project } from "./project"
import { User } from "./User"

@Entity()
export class ProjectUserRoles {

    @PrimaryGeneratedColumn()
    id: number

	@Column()
	userToRole: Map<User, string>

	@ManyToOne(() => Sprint, (sprint) => sprint.release)
	sprints: Sprint[]

	@ManyToOne(() => Project, (project) => project.roles)
	project?: Project
	
}
