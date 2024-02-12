import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, OneToMany, JoinColumn } from "typeorm"
import { User } from "./user"
import { Release } from "./release"
import { Story } from "./story"

@Entity()
export class Sprint {

    @PrimaryGeneratedColumn()
    id: number

	@Column()
	goal: string

	@ManyToOne(() => Release, (release) => release.sprints)
	release: Release[]

    @OneToOne(() => User)
	@JoinColumn()
    scrumMaster: User

	@OneToMany(() => Story, (story) => story.sprint)
	stories: Story[]
}
