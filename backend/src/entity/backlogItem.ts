import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, ManyToMany, CreateDateColumn, UpdateDateColumn, JoinTable, TableInheritance, ChildEntity } from "typeorm"
import { Sprint } from "./sprint"
import { Release } from "./release"
import { User } from "./User"
import { getMaybeUndefined, addMaybeUndefined, removeMaybeUndefined } from "./utils/addGetList"

export enum Priority {
	HIGH = 4,
	MEDIUM = 3,
	LOW = 2,
	NONE = 1,
}

@Entity()
@TableInheritance({ column: { type: "varchar", name: "type" } })
export class BacklogItem {

    @PrimaryGeneratedColumn()
    id: number

	@CreateDateColumn()
	createdDate: Date

	@UpdateDateColumn()
	updatedDate: Date

	///// Relational /////
	
	@ManyToOne(() => Release, (release) => release.backlog) // have this whether it is in a backlog or not?
	release: Release

	// deviating from diagram: each backlog item should only be in one backlog.
	// if you need it in another sprint (eg. did not finish it this sprint and want to move it to next), copy it
	// this way if you edit it in the new one, we don't change it in the previous sprints
	// also, work in a sprint should be completed within that sprint.
	@ManyToOne(() => Sprint, (sprint) => sprint.todos)
	sprint: Sprint // nullable in case it is just in the backlog

	@ManyToMany(() => User, (user) => user.assignments)
	@JoinTable()
	assignees: User[]

	///// Methods /////
	
	getAssignees(): User[] {
        return getMaybeUndefined(this.assignees);
    }
    addAssignee(user: User): void {
        this.assignees = addMaybeUndefined(user, this.assignees);
    }
    removeAssignee(user: User): void {
        this.assignees = removeMaybeUndefined(user, this.assignees);
    }
	copy(backlogItem: BacklogItem): void {
		this.createdDate = backlogItem.createdDate;
		this.updatedDate = backlogItem.updatedDate;
	}
}

// How to handle these? display them in anything?
// What fields do they have?
// Maybe just leave this alone for now... we will surely get a US for it soon
@ChildEntity()
export class Epic extends BacklogItem {

	@Column()
	userTypes: string

	@Column()
	functionalityDescription: string

	@Column()
	reasoning: string

	@OneToMany(() => Story, (story) => story.epic)
	stories: Story[]

}

@ChildEntity()
export class Story extends BacklogItem {

	@Column()
	userTypes: string

	@Column()
	functionalityDescription: string

	@Column()
	reasoning: string

	@Column()
	acceptanceCriteria: string

	@Column()
	storyPoints: number

	@Column({
		type: "enum",
		enum: Priority,
		default: Priority.NONE
	})
	priority: Priority

	///// Relational /////

	@ManyToOne(() => Epic, (epic) => epic.stories)
	epic?: Epic
	
	@OneToMany(() => Task, (task) => task.story)
	tasks: Task[]

	///// Methods /////
	
	getTasks(): Task[] {
        return getMaybeUndefined(this.tasks);
    }
    addTask(task: Task): void {
        this.tasks = addMaybeUndefined(task, this.tasks);
    }
    removeTask(task: Task): void {
        this.tasks = removeMaybeUndefined(task, this.tasks);
    }
	copy(story: Story): void {
		super.copy(story);
		this.userTypes = story.userTypes;
		this.functionalityDescription = story.functionalityDescription;
		this.reasoning = story.reasoning;
		this.acceptanceCriteria = story.acceptanceCriteria;
		this.storyPoints = story.storyPoints;
		this.priority = story.priority;
	}
}

@ChildEntity()
export class Task extends BacklogItem {

	@Column()
    description: string

	@Column()
    idealHours: number // may need to specify float?

	@ManyToOne(() => Story, (story) => story.tasks) // for tasks only
	story: Story

}

@ChildEntity()
export class Spike extends BacklogItem {

	@Column()
	description: string
	
}

@ChildEntity()
export class Infrastructure extends BacklogItem {

	@Column()
	description: string

}

@ChildEntity()
export class Bug extends BacklogItem {

	@Column()
	description: string

}
