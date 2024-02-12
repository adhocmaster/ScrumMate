import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from "typeorm"
import { Project } from "./project"

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column({
		unique: true
	})
    username: string

    @Column({
		unique: true
	})
    email: string

    @Column({
		type: "simple-json",
		select: false
	})
    authentication: {
		password: string,
		salt: string,
		sessionToken: string
	}

	@OneToMany(
		() => Project,
		(project) => project.productOwner
	)
	ownedProjects: Project
	
	@ManyToMany(
		() => Project,
		(project) => project.teamMembers
	)
	joinedProjects: Project
}
