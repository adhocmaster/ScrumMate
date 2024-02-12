import { AppDataSource } from "./data-source"
import { User } from "./entity/user"
import { Project } from "./entity/project"

AppDataSource.initialize().then(async () => {

    console.log("Inserting a new user into the database...")
    const user = new User()
    user.username = "11231231241"
    user.email = "erwt g"
    user.authentication = {password:"1", salt:  "1", sessionToken: "1"}
    await AppDataSource.manager.save(user)
    console.log("Saved a new user with id: " + user.id)

    console.log("Loading users from the database...")
    const users = await AppDataSource.manager.find(User)
    console.log("Loaded users: ", users)

    console.log("Here you can setup and run express / fastify / any other framework.")

}).catch(error => console.log(error))
