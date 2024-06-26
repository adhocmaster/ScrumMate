import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, ManyToMany, CreateDateColumn, UpdateDateColumn, JoinTable, TableInheritance, ChildEntity } from "typeorm"
import { Sprint } from "./sprint"
import { Release } from "./release"
import { User } from "./User"
import { getMaybeUndefined, addMaybeUndefined, removeMaybeUndefined } from "./utils/addGetList"

export enum Priority {
	NONE = 1,
	LOW = 2,
	MEDIUM = 3,
	HIGH = 4,
}

export enum ActionType {
	BUG = 1,
	SYSTEMFEATURE = 2,
	SPIKE = 3,
	INFRASTRUCTURE = 4,
}

@Entity()
@TableInheritance({ column: { type: "varchar", name: "type" } })
export class BacklogItem {
	public name = "BacklogItem";

	@PrimaryGeneratedColumn()
	id: number

	@CreateDateColumn()
	createdDate: Date

	@UpdateDateColumn()
	updatedDate: Date

	@Column()
	rank: number // "index"

	@Column({ nullable: true })
	size: number // serves as SP, IH, etc...

	@Column({ default: false })
	pokerIsOver: boolean

	// may need to change type to other json type if switching db
	// map userId to [String(current round estimate), String(previous round estimate), estimatedThisRound]
	@Column({ type: 'simple-json', default: {} })
	estimates: Record<number, [string, string, boolean]>;

	///// Relational /////

	@ManyToOne(() => Release, (release) => release.backlog)
	release: Release

	@ManyToOne(() => Sprint, (sprint) => sprint.todos, { nullable: true })
	sprint: Sprint

	@ManyToOne(() => Release, (release) => release.deletedBacklog)
	deletedFrom: Release

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
		this.rank = backlogItem.rank;
		this.size = backlogItem.size;
	}
}

// How to handle these? display them in anything?
// What fields do they have?
// Maybe just leave this alone for now... we will surely get a US for it soon
// Sponsor said ignore Epics for now
@ChildEntity()
export class Epic extends BacklogItem {
	public name = "Epic";

	@Column()
	userTypes: string

	@Column()
	functionalityDescription: string

	@Column()
	reasoning: string

	@OneToMany(() => Story, (story) => story.epic)
	stories: Story[]

	copy(epic: Epic): void {
		super.copy(epic)
		this.userTypes = epic.userTypes;
		this.functionalityDescription = epic.functionalityDescription;
		this.reasoning = epic.reasoning;
	}
}

@ChildEntity()
export class Story extends BacklogItem {
	public name = "Story";

	@Column()
	userTypes: string

	@Column()
	functionalityDescription: string

	@Column()
	reasoning: string

	@Column()
	acceptanceCriteria: string

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
		this.priority = story.priority;
	}
}

@ChildEntity()
export class Task extends BacklogItem {
	public name = "Task";

	@Column()
	description: string

	@ManyToOne(() => Story, (story) => story.tasks)
	story: Story

	copy(task: Task): void {
		super.copy(task)
		this.description = task.description;
	}
}

@ChildEntity()
export class ActionItem extends BacklogItem {
	public name = "ActionItem";

	@Column({
		type: "enum",
		enum: ActionType,
		default: ActionType.BUG
	})
	actionType: ActionType

	@Column()
	description: string

	@Column({
		type: "enum",
		enum: Priority,
		default: Priority.NONE
	})
	priority: Priority

	copy(actionItem: ActionItem): void {
		super.copy(actionItem)
		this.actionType = actionItem.actionType;
		this.description = actionItem.description;
		this.priority = actionItem.priority;
	}
}
