import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from "typeorm"
import { Project } from "./project"
import { Release } from "./release"

// Stores the information such as Release 1.0.0, Revision 1
@Entity()
export class Revision {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    majorVersion: number

    @Column()
    minorVersion: number

    @Column()
    patchVersion: number
    
	@Column()
    revision: number

	@ManyToOne(() => Project, (project) => project.revisions)
	project: Project

	@OneToOne(() => Release, (release) => release.revision)
	@JoinColumn()
	release: Release

}
