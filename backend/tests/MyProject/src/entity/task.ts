import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { Story } from "./story"

// Stores the information such as Release 1.0.0, Revision 1
@Entity()
export class Task {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    todo: string

    @Column()
    estimate: number

	@ManyToOne(() => Story, (story) => story.tasks)
	story: Story

}
