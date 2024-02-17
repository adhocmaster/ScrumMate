import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany } from "typeorm"
import { User } from "./User"
import { addMaybeUndefined, getMaybeUndefined, removeMaybeUndefined } from "./utils/addGetList"
import { Release } from "./release"
import { ProjectUserRoles } from "./roles"

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

	@OneToMany(() => Release, (release) => release.project)
	releases: Release[]

	@OneToMany(() => ProjectUserRoles, (role) => role.project)
	roles: ProjectUserRoles[]

	getTeamMembers(): User[] {
		return getMaybeUndefined(this.teamMembers)
	}

	addTeamMember(member: User): void {
		this.teamMembers = addMaybeUndefined(member, this.teamMembers)
	}

	removeTeamMember(member: User): void {
		this.teamMembers = removeMaybeUndefined(member, this.teamMembers)
	}
	
	getReleases(): Release[] {
		return getMaybeUndefined(this.releases)
	}

	addRelease(release: Release): void {
		this.releases = addMaybeUndefined(release, this.releases)
	}

	removeRelease(release: Release): void {
		this.releases = removeMaybeUndefined(release, this.releases)
	}
	
}
