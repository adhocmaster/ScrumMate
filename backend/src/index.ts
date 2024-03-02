import express from 'express';
import { AppDataSource, Database } from './data-source';
import { Release } from "./entity/release"
import { Project } from './entity/project';
import router from './router/index';
import { User } from './entity/User';
import { Spike, Story, Task } from './entity/backlogItem';
import { UserRole } from './entity/roles';
import { Sprint } from './entity/sprint';

const app = express();

AppDataSource.initialize().then(async () => {
	/// Initializing som basic information for the frontend
	/// TEMPORARY CODE UNTIL THE SIGNIN AND PROJECT SELECTION PAGES ARE DONE
	const db = Database.setAndGetInstance(AppDataSource)
	const productOwner1 = new User()
	productOwner1.username = "mr. fakeperson"
	productOwner1.email = "fakeperson@nonexistent.mmm"
	productOwner1.password = "hamburger"
	productOwner1.salt = "salt"
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

	/// Start express
	app.use(express.json())
  	app.use('/api', router());
	app.listen(8080, () => {
		console.log("Running on port 8080")
	})
}).catch(error => console.log(error))
