import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany } from "typeorm"
import { User } from "./user"
import { Revision } from "./revision"

@Entity()
export class Project {

    @PrimaryGeneratedColumn()
    id: number

	@Column()
	name: string

    @ManyToOne(() => User, (user) => user.ownedProjects)
    productOwner: User
    
	@ManyToMany(() => User, (user) => user.joinedProjects)
    teamMembers: User[]

	@OneToMany(() => Revision, (revision) => revision.project)
	revisions: Revision[]

}
