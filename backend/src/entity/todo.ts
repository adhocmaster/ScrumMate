import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, ManyToMany } from "typeorm"
import { Sprint } from "./sprint"
import { Story } from "./utils/story"
import { Project } from "./project"
import { Release } from "./release"
import { ProjectUserRoles } from "./roles"

@Entity()
export class TodoItem {

    @PrimaryGeneratedColumn()
    id: number

	@OneToMany(() => Release, (release) => release.backlog)
	release: Release[]

	@OneToMany(() => ProjectUserRoles, (role) => role.todoItem)
	roles?: ProjectUserRoles[]

	@ManyToOne(() => Project, (project) => project.releases)
	project: Project
	
	@ManyToMany(() => Sprint, (story) => story.stories)
	sprint: Sprint[]
}
