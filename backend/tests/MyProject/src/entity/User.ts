import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from "typeorm"
import { Project } from "./project"

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column({unique: true})
    username: string

    @Column({unique: true})
    email: string

	// Authentication
    @Column({select: false})
	password: string
	@Column({select: false})
	salt: string
    @Column({select: false})
	sessionToken: string

	@OneToMany(() => Project, (project) => project.productOwner)
	ownedProjects: Project[]
	
	@ManyToMany(() => Project, (project) => project.teamMembers)
	@JoinTable()
	joinedProjects: Project[]
}
