import express from 'express';
// import http from 'http';
// import bodyParser from 'body-parser';
// import cookieParser from 'cookie-parser';
// import compression from 'compression';
// import cors from 'cors';
// import router from './router'
// import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm"
// import "reflect-metadata"
import { AppDataSource } from './data-source';
import { Release } from "./entity/release"
import { createRelease } from './router/create_release';
import { Project } from './entity/project';
import { fetchProjectReleases } from './router/fetchProjectReleases';
import { saveRelease } from './router/save_release';

const app = express();

AppDataSource.initialize().then(async () => {

    // console.log("Inserting a new user into the database...")
    // const release = new Release()
	// release.revision = 1
	// release.revisionDate = new Date()
	// release.problemStatement = "31231sdan24235"
    // release.goalStatement = "413rquterouvnbyoai"
    // await AppDataSource.manager.save(release)
    // console.log("Saved a new release with id: " + release.id)

    // console.log("Loading releases from the database...")
    // const releases = await AppDataSource.manager.find(Release)
    // console.log("Loaded releases: ", releases)

    // console.log("Here you can setup and run express / fastify / any other framework.")

	app.use(express.json())

	app.use(createRelease);
	app.use(fetchProjectReleases);
	app.use(saveRelease);

	app.listen(8080, () => {
		console.log("Running on port 8080")
	})

	// const releaseRepository = await AppDataSource.getRepository(Release)
	// const projectRepository = await AppDataSource.getRepository(Project)

	// POST save release
	// var release1 = new Release()
	// release1.revision = 1
	// release1.revisionDate = new Date()
	// release1.problemStatement = "Scrum Tools is making too much money that the rest of the world is now in poverty"
	// release1.goalStatement = "We are gonna make the product even better to take the rest of their money"
	// await releaseRepository.save(release1)
	// const releases = await releaseRepository.find({order: {
	// 	id: "DESC"
	// }})
	// release1 = releases[0] // get biggest ID
	// console.log(release1)


	// // GET project releases
	// var proj = new Project() 
	// proj.name = "scrum tools"
	// const release1 = new Release()
	// release1.revision = 1
	// release1.revisionDate = new Date()
	// release1.problemStatement = "Scrum Tools is making too much money that the rest of the world is now in poverty"
	// release1.goalStatement = "We are gonna make the product even better to take the rest of their money"
	// release1.project = proj
	// const release2 = new Release()
	// release2.revision = 2
	// release2.revisionDate = new Date()
	// release2.problemStatement = "Scrum Tools is bankrupt"
	// release2.goalStatement = "We want to make $1 by December"
	// release2.project = proj
	// proj.releases = [release1, release2]
	// await projectRepository.save(proj)
	// await releaseRepository.save(release1)
	// await releaseRepository.save(release2)
	// const projects = await projectRepository.find({order: {
	// 	id: "DESC"
	// }})
	// proj = projects[0] // get biggest ID
	// console.log(proj)

	// // The frontend will create something by another API call to get id, but I dont have that yet
	// var proj = new Project() 
	// proj.name = "scrum tools"
	// projectRepository.save(proj)
	// const projects = await projectRepository.find({order: {
	// 	id: "DESC"
	// }})
	// proj = projects[0] // get biggest ID

	// console.log("before")
	// console.log(await AppDataSource.manager.find(Release))
	// console.log(await AppDataSource.manager.find(Project))
	// const releasePlanData = {
	// 	revision: 12,
	// 	revisionDate: new Date(),
	// 	problemStatement: "Scrum Tools is making too much money that the rest of the world is now in poverty",
	// 	goalStatement: "We are gonna make the product even better to take the rest of their money",
	// 	projID: proj.id
	// }
	
	// await fetch(`http://localhost:8080/api/release`, {
	// 	method: 'POST',
	// 	headers: {
	// 		'Content-Type': 'application/json'
	// 	},
	// 	credentials: 'include',
	// 	body: JSON.stringify(releasePlanData)
	// }).then((result) => {
	// 	// console.log(result)
	// 	console.log(result.ok)
	// 	// if (result.status === 200) {
	// 	// 	console.log(result)
	// 	// } 
	// })

	// console.log("after")
	// console.log(await AppDataSource.manager.find(Release, {relations: {project: true}}))

}).catch(error => console.log(error))

// app.use(cors({
//     origin:"http://localhost:3000",
//     credentials: true,
// }));

// app.use(compression()); 
// app.use(cookieParser());
// app.use(bodyParser.json());

// const server = http.createServer(app)

// server.listen(3001, ()=>{
//     console.log("server running on http://localhost:3001")
// })

// app.use('/',router())