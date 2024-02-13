import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany } from "typeorm"
import { Revision } from "./revision"
import { Sprint } from "./sprint"
import { Story } from "./story"

@Entity()
export class Release {

    @PrimaryGeneratedColumn()
    id: number

	@Column()
	problemStatement: string

	@Column()
	goalStatement: string
	
	@OneToOne(() => Revision, (revision) => revision.release)
	revision: Revision

	@OneToMany(() => Sprint, (sprint) => sprint.release)
	sprints: Sprint[]

	@OneToMany(() => Story, (story) => story.release)
	backlog: Story[]
}
