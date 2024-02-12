import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany } from "typeorm"
import { User } from "./user"

@Entity()
export class Project {

    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(
		() => User,
		(user) => user.ownedProjects
	)
    productOwner: User
    
	@ManyToMany(
		() => User,
		(user) => user.joinedProjects
	)
    teamMembers: User

}
