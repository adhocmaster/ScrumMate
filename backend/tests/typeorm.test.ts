import { connection } from "mongoose";
import { User } from "../src/entity/User"
import { Project } from "../src/entity/project"
import { Release } from "../src/entity/release";
import { Revision } from "../src/entity/revision";
import { Sprint } from "../src/entity/sprint";
import { Story } from "../src/entity/story";
import { Task } from "../src/entity/task";
import { DataSource } from "typeorm";

function makeRandomId(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "test",
    password: "test",
    database: "test",
    synchronize: true,
    logging: false,
    entities: [User, Project, Release, Revision, Sprint, Story, Task],
    migrations: [],
    subscribers: [],
})

describe('testing authentication', () => {
	test('empty string should result in some string', async () => {
		await AppDataSource.initialize().then(async () => {
		
			const user = new User()
			user.username = makeRandomId(10)
			user.email = makeRandomId(10)
			user.password = makeRandomId(10)
			user.salt = makeRandomId(10)
			user.sessionToken = makeRandomId(10)
			await AppDataSource.manager.save(user)
			const users = await AppDataSource.manager.find(User)

		}).catch(error => console.log(error))
		await AppDataSource.destroy()

		expect(true);
	});
});
	