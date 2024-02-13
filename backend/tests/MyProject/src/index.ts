import { AppDataSource } from "./data-source"
import { User } from "../../../src/entity/User"
import { Project } from "../../../src/entity/project"
import * as express from "express";
import { random } from "lodash";
import { createUserRouter } from "./routes/create_user";

const app = express();

AppDataSource.initialize().then(async () => {

    console.log("Inserting a new user into the database...")
    const user = new User()
    user.username = "31231sdan24235"
    user.email = "413rquterouvnbyoai"
    user.password = "1"
    user.salt = "1"
    user.sessionToken = "1"
    await AppDataSource.manager.save(user)
    console.log("Saved a new user with id: " + user.id)

    console.log("Loading users from the database...")
    const users = await AppDataSource.manager.find(User)
    console.log("Loaded users: ", users)

    console.log("Here you can setup and run express / fastify / any other framework.")

	app.use(express.json())
	app.use(createUserRouter);
	app.listen(8080, () => {
		console.log("Running on port 8080")
	})

}).catch(error => console.log(error))
