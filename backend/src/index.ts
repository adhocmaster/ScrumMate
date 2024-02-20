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
import { fetchReleaseVersions } from './controllers/release';

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

	app.use(fetchReleaseVersions);

	app.listen(8080, () => {
		console.log("Running on port 8080")
	})

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