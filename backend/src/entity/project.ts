import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany } from "typeorm"
import { User } from "./User"
import { Revision } from "./revision"
import { addMaybeUndefined, getMaybeUndefined } from "./utils/addGetList"

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

	getTeamMembers(): User[] {
		return getMaybeUndefined(this.teamMembers)
	}

	addTeamMember(member: User): void {
		this.teamMembers = addMaybeUndefined(member, this.teamMembers)
	}
	
	getRevisions(): Revision[] {
		return getMaybeUndefined(this.revisions)
	}

	addRevision(revision: Revision): void {
		this.revisions = addMaybeUndefined(revision, this.revisions)
	}
}
