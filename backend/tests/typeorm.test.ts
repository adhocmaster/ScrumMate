import { User } from "../src/entity/User"
import { Project } from "../src/entity/project"
import { Release } from "../src/entity/release";
import { Sprint } from "../src/entity/sprint";
import { DataSource } from "typeorm";
import { Epic, Story, Task, TodoItem } from "../src/entity/todo";
import { ProjectUserRoles } from "../src/entity/roles";

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
    entities: [User, Project, Release, Sprint, ProjectUserRoles, TodoItem, Epic, Story, Task],
    migrations: [],
    subscribers: [],
})

describe('testing user/project can reference one another, get/add methods', () => {
	var project1 = new Project()
	var project2 = new Project()
	var project3 = new Project()

	const productOwner1 = new User()
	const productOwner2 = new User()

	const teammember1 = new User()
	const teammember2 = new User()
	
	productOwner1.addOwnedProject(project1)
	productOwner1.addOwnedProject(project2)
	productOwner2.addOwnedProject(project3)
	
	project1.productOwner = productOwner1
	project2.productOwner = productOwner1
	project3.productOwner = productOwner2

	productOwner2.addJoinedProject(project1);
	teammember1.addJoinedProject(project1)
	teammember1.addJoinedProject(project2)
	teammember2.addJoinedProject(project2)

	project1.addTeamMember(productOwner2)
	project1.addTeamMember(teammember1)
	project2.addTeamMember(teammember1)
	project2.addTeamMember(teammember2)

	test('get/add OwnedProjects works', () => {
		// use .toStrictEqual() bc otherwise circular breaks toBe
		expect(productOwner1.getOwnedProjects()).toStrictEqual([project1, project2])
		expect(productOwner2.getOwnedProjects()).toStrictEqual([project3])
		expect(teammember1.getOwnedProjects()).toStrictEqual ([])
	});

	test('projects have the correct product owners', () => {
		expect(project1.productOwner).toBe(productOwner1)
		expect(project2.productOwner).toBe(productOwner1)
		expect(project3.productOwner).toBe(productOwner2)
	});

	test('get/add JoinedProjects works', () => {
		expect(productOwner1.getJoinedProjects()).toStrictEqual([])
		expect(productOwner2.getJoinedProjects()).toStrictEqual([project1])
		expect(teammember1.getJoinedProjects()).toStrictEqual([project1, project2])
		expect(teammember2.getJoinedProjects()).toStrictEqual([project2])
	});

	test('get/add TeamMembers works', () => {
		expect(project1.getTeamMembers()).toStrictEqual([productOwner2, teammember1])
		expect(project2.getTeamMembers()).toStrictEqual([teammember1, teammember2])
		expect(project3.getTeamMembers()).toStrictEqual([])
	});

	// OLD TEST that does everything, also has the code to set up a database which we cant do yet
	// test('', () => {
	// // test('empty string should result in some string', async () => {
	// 	// await AppDataSource.initialize().then(async () => {

	// 		expect(productOwner1.getOwnedProjects()).toStrictEqual([project1, project2])
	// 		expect(productOwner2.getOwnedProjects()).toStrictEqual([project3])
	// 		expect(teammember1.getOwnedProjects()).toStrictEqual ([])

	// 		expect(project1.productOwner).toBe(productOwner1)
	// 		expect(project2.productOwner).toBe(productOwner1)
	// 		expect(project3.productOwner).toBe(productOwner2)

	// 		expect(productOwner1.getJoinedProjects()).toStrictEqual([])
	// 		expect(productOwner2.getJoinedProjects()).toStrictEqual([project1])
	// 		expect(teammember1.getJoinedProjects()).toStrictEqual([project1, project2])
	// 		expect(teammember2.getJoinedProjects()).toStrictEqual([project2])

	// 		// const users = await AppDataSource.manager.find(User) // find just users
	// 		// const users = await AppDataSource // one line but clunky
	// 		// 	.getRepository(User)
	// 		// 	.createQueryBuilder("User")
	// 		// 	.leftJoinAndSelect("User.ownedProjects", "project")
	// 		// 	.getMany()
	// 		// const usersRepository = await AppDataSource.getRepository(User) // bigger but can be reused
	// 		// const users = await usersRepository.find({
	// 		// 	relations: {
	// 		// 		ownedProjects: true,
	// 		// 	}
	// 		// })
			
	// 		// usersRepository.createQueryBuilder().delete().execute() // not sure how to delete
			
	// 	// }).catch(error => console.log(error))
	// 	// await AppDataSource.destroy()

	// });
});
	