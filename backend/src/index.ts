import express from 'express';
import { AppDataSource } from './data-source';
import { Database } from './db/database';
import { Release } from "./entity/release"
import {Sprint} from './entity/sprint';
import {Story} from './entity/backlogItem';
import { Project } from './entity/project';
import router from './router/index';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { User } from './entity/User';
import { authentication } from './helpers';

const app = express();

AppDataSource.initialize().then(async () => {
	/// Initializing som basic information for the frontend
	/// TEMPORARY CODE UNTIL THE SIGNIN AND PROJECT SELECTION PAGES ARE DONE
	const db = Database.setAndGetInstance(AppDataSource)
	// await db.deleteAll() // not working

	const productOwner1 = new User()
	productOwner1.username = "bob"
	productOwner1.email = "bob@gmail.com"
	productOwner1.salt = "salt"
	productOwner1.password = authentication(productOwner1.salt, "pass")
	productOwner1.id = 1
	await db.save(productOwner1)

	var project1 = new Project()
	project1.name = "scrum tools"
	project1.nextRevision = 3
	project1.productOwner = productOwner1
	project1.id = 1
	await db.save(project1)

	const release1 = new Release()
	release1.revision = 1
	release1.revisionDate = new Date()
	release1.problemStatement = "There are no problems"
	release1.goalStatement = "Keep everything fine"
	release1.project = project1
	release1.id = 1
	await db.save(release1)

	const release2 = new Release()
	release2.revision = 2
	release2.revisionDate = new Date()
	release2.problemStatement = "There are many problems"
	release2.goalStatement = "Must fix all the problems"
	release2.project = project1
	release2.id = 2
	await db.save(release2)

	const sprint1 = new Sprint()
	sprint1.release = release1;
	sprint1.sprintNumber = 1;
	sprint1.startDate = new Date();
	sprint1.endDate = new Date();
	sprint1.goal = "finsih sprint"
	sprint1.id = 1
	await db.save(sprint1);

	const sprint2 = new Sprint()
	sprint2.release = release1;
	sprint2.sprintNumber = 2;
	sprint2.startDate = new Date();
	sprint2.endDate = new Date();
	sprint2.goal = "finsih sprint"
	sprint2.id = 2
	await db.save(sprint2);

	const sprint3 = new Sprint()
	sprint3.release = release1;
	sprint3.sprintNumber = 3;
	sprint3.startDate = new Date();
	sprint3.endDate = new Date();
	sprint3.goal = "finsih sprint"
	sprint3.id = 3
	await db.save(sprint3);

	const backlog1 = new Story()
	backlog1.sprint = sprint1;
	backlog1.userTypes = "none";
	backlog1.reasoning = "there is no reasoning at all"
	backlog1.acceptanceCriteria = "There is no acceptance criteria"
	backlog1.storyPoints = 8;
	backlog1.functionalityDescription = "This is the first backlog item"
	await db.save(backlog1);

	const backlog2 = new Story()
	backlog2.sprint = sprint1;
	backlog2.userTypes = "none";
	backlog2.reasoning = "there is no reasoning at all"
	backlog2.acceptanceCriteria = "There is no acceptance criteria"
	backlog2.storyPoints = 10;
	backlog2.functionalityDescription = "This is the functionality."
	await db.save(backlog2);


	const backlog3 = new Story()
	backlog3.sprint = sprint2;
	backlog3.userTypes = "none";
	backlog3.reasoning = "there is no reasoning at all"
	backlog3.acceptanceCriteria = "There is no acceptance criteria"
	backlog3.storyPoints = 12;
	backlog3.functionalityDescription = "Backlog Item for sprint2."
	await db.save(backlog3);

	const backlog4 = new Story()
	backlog4.sprint = sprint2;
	backlog4.userTypes = "none";
	backlog4.reasoning = "there is no reasoning at all"
	backlog4.acceptanceCriteria = "There is no acceptance criteria"
	backlog4.storyPoints = 12;
	backlog4.functionalityDescription = "Second Backlog Item for sprint2."
	await db.save(backlog4);


	/// Start express
	app.use(express.json())
	app.use(cors({
		origin:"http://localhost:3000",
		credentials: true,
	}));
	app.use(cookieParser());
	app.use('/api', router());
	app.listen(8080, () => {
		console.log("Running on port 8080")
	})
}).catch(error => console.log(error))
