import express from 'express';
import { AppDataSource } from './data-source';
import { Database } from './db/database';
import { Release } from "./entity/release"
import { Sprint } from './entity/sprint';
import { Story } from './entity/backlogItem';
import { Project } from './entity/project';
import router from './router/index';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { User } from './entity/User';
import { authentication } from './helpers';

const app = express();

function addDays(date: Date, numDays: number): Date {
	return new Date(date.getDate() + numDays);
}

AppDataSource.initialize().then(async () => {
	/// Initializing som basic information for the frontend
	/// TEMPORARY CODE UNTIL THE SIGNIN AND PROJECT SELECTION PAGES ARE DONE
	console.log('initializing system')
	const CREATEDATA = true;

	const db = Database.setAndGetInstance(AppDataSource);
	try {
		await db.getUserRepository.lookupUserByEmail("bob@gmail.com")
		if (CREATEDATA) {
			throw new Error("going to catch condition")
		}
	} catch {
		const productOwner1 = new User()
		productOwner1.username = "bob"
		productOwner1.email = "bob@gmail.com"
		productOwner1.salt = "salt"
		productOwner1.password = authentication(productOwner1.salt, "pass")
		productOwner1.id = 1
		await db.save(productOwner1)

		const joinedUser = new User()
		joinedUser.username = "joe"
		joinedUser.email = "joe@gmail.com"
		joinedUser.salt = "salt"
		joinedUser.password = authentication(joinedUser.salt, "pass")
		joinedUser.id = 2
		await db.save(joinedUser)

		const unjoinedUser = new User()
		unjoinedUser.username = "unjoined"
		unjoinedUser.email = "unjoined@gmail.com"
		unjoinedUser.salt = "salt"
		unjoinedUser.password = authentication(unjoinedUser.salt, "pass")
		unjoinedUser.id = 3
		await db.save(unjoinedUser)

		var project1 = new Project()
		project1.name = "Plannertarium"
		project1.numRevisions = 2
		project1.productOwner = productOwner1
		project1.teamMembers = [joinedUser]
		project1.invitedUsers = [unjoinedUser]
		project1.id = 1
		await db.save(project1)

		var project2 = new Project()
		project2.name = "Empty Project"
		project2.numRevisions = 1
		project2.productOwner = productOwner1
		project2.teamMembers = []
		project2.id = 2
		await db.save(project2)

		const release1 = new Release()
		release1.revision = 1
		release1.revisionDate = new Date()
		release1.problemStatement = "The problem we noticed was that many current planner applications are very general purpose and provide only the bare bones for managing tasks, and often lack event management in the same application. This leaves an opening for planners targeted for students who want additional task management features such as moving a homework assignment to the next day after partial completion, or being able to see deadlines on the planner. Our planner aims to implement many of these extra features in a task and event based planner application tailored for students."
		release1.goalStatement = "The core of our app revolves around the idea of tasks and events. Tasks are things like assignments, reminders, and generally things that may go on a to-do list. Events are recurring things like classes or club meetings that happen at a certain time for certain durations. We plan to provide intuitive interfaces to create, edit, complete, view, and organize both tasks and events. A user’s intentions should be easily identified and addressed with gestures and actions. Users should also be able to view a near real time representation of their schedule on any device they are signed in on. Overall, users should enjoy using the app and not feel like their actions can’t keep up with their thoughts."
		release1.project = project1
		release1.id = 1
		release1.backlogItemCount = 0
		await db.save(release1)

		const release2 = new Release()
		release2.revision = 2
		release2.revisionDate = new Date()
		release2.problemStatement = "The problem we noticed was that many current planner applications are very general purpose and provide only the bare bones for managing tasks, and often lack event management in the same application. This leaves an opening for planners targeted for students who want additional task management features such as moving a homework assignment to the next day after partial completion."
		release2.goalStatement = "The core of our app revolves around the idea of tasks and events. Tasks are things like assignments, reminders, and generally things that may go on a to-do list. Events are recurring things like classes or club meetings that happen at a certain time for certain durations."
		release2.project = project1
		release2.id = 2
		release2.backlogItemCount = 2
		await db.save(release2)

		const sprint1 = new Sprint()
		sprint1.release = release2;
		sprint1.sprintNumber = 1;
		sprint1.startDate = new Date();
		sprint1.endDate = addDays(sprint1.startDate, 7);
		sprint1.goal = "Create the basic and foundational functionality and UI for the application. Establish infrastructure and get familiar with Flutter and Firebase."
		sprint1.id = 1
		sprint1.backlogItemCount = 3
		sprint1.scrumMaster = productOwner1;
		await db.save(sprint1);

		const sprint2 = new Sprint()
		sprint2.release = release2;
		sprint2.sprintNumber = 2;
		sprint2.startDate = new Date();
		sprint2.endDate = addDays(sprint2.startDate, 7);
		sprint2.goal = "Create the basic and foundational functionality and UI for the application. Establish infrastructure and get familiar with Flutter and Firebase."
		sprint2.id = 2
		sprint2.backlogItemCount = 2
		sprint1.scrumMaster = joinedUser;
		await db.save(sprint2);

		const sprint3 = new Sprint()
		sprint3.release = release2;
		sprint3.sprintNumber = 3;
		sprint3.goal = "Have complete user interfaces for essential parts of the application. Implement simple nonessential features into the task and event planner."
		sprint3.id = 3
		sprint3.backlogItemCount = 0
		await db.save(sprint3);

		const backlog_s1_1 = new Story()
		backlog_s1_1.id = 1;
		backlog_s1_1.sprint = sprint1;
		backlog_s1_1.userTypes = "student";
		backlog_s1_1.functionalityDescription = "see my inputted information when I reopen the app"
		backlog_s1_1.reasoning = "I do not need to keep it open"
		backlog_s1_1.acceptanceCriteria = "Can log in and log out, and access user id within the app"
		backlog_s1_1.rank = 0
		await db.save(backlog_s1_1);

		const backlog_s1_2 = new Story()
		backlog_s1_2.id = 2;
		backlog_s1_2.sprint = sprint1;
		backlog_s1_2.userTypes = "student";
		backlog_s1_2.functionalityDescription = "create tasks."
		backlog_s1_2.reasoning = "I can see what my tasks are"
		backlog_s1_2.acceptanceCriteria = "Can create tasks in an interface and see it on the list"
		backlog_s1_2.rank = 1
		await db.save(backlog_s1_2);

		const backlog_s1_3 = new Story()
		backlog_s1_3.id = 3;
		backlog_s1_3.sprint = sprint1;
		backlog_s1_3.userTypes = "student";
		backlog_s1_3.functionalityDescription = "change properties of a task."
		backlog_s1_3.reasoning = "I can mark them as completed, move to another date, etc"
		backlog_s1_3.acceptanceCriteria = "Can edit tasks in an interface and see it reflected in the list"
		backlog_s1_3.rank = 2
		await db.save(backlog_s1_3);


		const backlog_s2_1 = new Story()
		backlog_s2_1.id = 4;
		backlog_s2_1.sprint = sprint2;
		backlog_s2_1.userTypes = "student";
		backlog_s2_1.functionalityDescription = "manage my tasks in various time frames"
		backlog_s2_1.reasoning = "I can get the amount of detail I need to plan my schedule"
		backlog_s2_1.acceptanceCriteria = "Be able to see names of tasks in all views and be able to add tasks, be able to edit the information in this view"
		backlog_s2_1.rank = 0
		await db.save(backlog_s2_1);

		const backlog_s2_2 = new Story()
		backlog_s2_2.id = 5;
		backlog_s2_2.sprint = sprint2;
		backlog_s2_2.userTypes = "student";
		backlog_s2_2.functionalityDescription = "move my tasks around the timeline"
		backlog_s2_2.reasoning = "I can assign them to other days"
		backlog_s2_2.acceptanceCriteria = "Successfully use gestures to modify/move a task, be able to see it on the new date after the gesture is done"
		backlog_s2_2.rank = 1
		await db.save(backlog_s2_2);

		const backlog_r2_1 = new Story()
		backlog_r2_1.id = 6;
		backlog_r2_1.release = release2;
		backlog_r2_1.userTypes = "student";
		backlog_r2_1.functionalityDescription = "manage my events in various time frames"
		backlog_r2_1.reasoning = " I can get the amount of detail I need to plan my schedule"
		backlog_r2_1.acceptanceCriteria = "Can switch from daily to weekly to monthly view and vis versa"
		backlog_r2_1.rank = 0
		await db.save(backlog_r2_1);

		const backlog_r2_2 = new Story()
		backlog_r2_2.id = 7;
		backlog_r2_2.release = release2;
		backlog_r2_2.userTypes = "student";
		backlog_r2_2.functionalityDescription = "edit an event"
		backlog_r2_2.reasoning = "I can keep the planner up to date with changes to my schedule"
		backlog_r2_2.acceptanceCriteria = "In the larger view of an event, be able to see and edit all fields of the event"
		backlog_r2_2.rank = 1
		await db.save(backlog_r2_2);

		const backlog_r2_3 = new Story()
		backlog_r2_3.id = 8;
		backlog_r2_3.release = release2;
		backlog_r2_3.userTypes = "student";
		backlog_r2_3.functionalityDescription = "Look at different time windows"
		backlog_r2_3.reasoning = "I can plan for the short, medium and long term as needed"
		backlog_r2_3.acceptanceCriteria = "Able to move from daily view to monthly view with UI and gestures"
		backlog_r2_3.rank = 2
		await db.save(backlog_r2_3);
	}

	/// Start express
	app.use(express.json())
	app.use(cors({
		origin: "http://localhost:3000",
		credentials: true,
	}));
	app.use(cookieParser());
	app.use('/api', router());
	app.listen(8080, () => {
		console.log("Running on port 8080")
	})
}).catch(error => console.log(error))
