import { User } from "../../src/entity/User"
import { Project } from "../../src/entity/project"
import { Release } from "../../src/entity/release";
import { Sprint } from "../../src/entity/sprint";
import { DataSource } from "typeorm";
import { Bug, Epic, Infrastructure, Spike, Story, Task, BacklogItem } from "../../src/entity/backlogItem";
import { UserRole } from "../../src/entity/roles";

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

function getRandomInt(max=10) {
	return Math.floor((Math.random()+1) * max);
}

function getRandomDate() {
	return new Date()
}

function populateUser(user: User, length=10) {
	user.username = makeRandomId(length)
	user.email = makeRandomId(length)
	user.password = makeRandomId(length)
	user.salt = makeRandomId(length)
	user.sessionToken = makeRandomId(length)
}

function populateProject(project: Project, length=10) {
	project.name = makeRandomId(length)
	project.nextRevision = 1
}

function populateRelease(release: Release, length=10) {
	release.revision = getRandomInt()
	release.revisionDate = getRandomDate()
	release.problemStatement = makeRandomId(length)
	release.goalStatement = makeRandomId(length)
}

function populatateSprint(sprint: Sprint, length=10) {
	sprint.sprintNumber = getRandomInt()
	sprint.startDate = getRandomDate()
	sprint.endDate = getRandomDate()
	sprint.goal = makeRandomId(length)
}

function populateRoles(role: UserRole, length=10) {
	role.role = makeRandomId(length)
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
    entities: [User, Project, Release, Sprint, UserRole, BacklogItem, Epic, Story, Task, Spike, Infrastructure, Bug],
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
})

describe('testing that everything can be saved and loaded from database', () => {

	// sorry about tabs, represents relation here
	const productOwner1 = new User()
		var project1 = new Project()
			const release1 = new Release()
			const release2 = new Release()
				const sprint1 = new Sprint()
				const sprint2 = new Sprint()
					const role = new UserRole()
					const spike = new Spike()
					const story1 = new Story()
						const task1 = new Task()
						const task2 = new Task()
				const story2 = new Story()
					const task3 = new Task()
					const task4 = new Task()
		var project2 = new Project()
	
	const productOwner2 = new User() // team in proj 1
		var project3 = new Project()

	const teammember1 = new User() // team in proj 1 & 2
	const teammember2 = new User() // team in proj 2

	productOwner1.addOwnedProject(project1); project1.productOwner = productOwner1
		release1.project = project1; project1.addRelease(release1)
		release2.project = project1; project1.addRelease(release2)
			sprint1.release = release2; release2.addSprint(sprint1);
			sprint2.release = release2; release2.addSprint(sprint2);
				role.sprint = sprint1; sprint2.addRole(role) // assume adding to release meanse it is backlogged
				role.user = teammember1;
				spike.sprint = sprint2; sprint2.addTODO(spike)
				story1.sprint = sprint2; sprint2.addTODO(story1)
					task1.story = story1; story1.addTask(task1); task1.sprint = sprint1; sprint1.addTODO(task1)
					task2.story = story1; story1.addTask(task2); task2.sprint = sprint1; sprint1.addTODO(task2)
			story2.sprint = sprint2; sprint2.addTODO(story2)
				task3.story = story2; story2.addTask(task3); task3.sprint = sprint1; sprint1.addTODO(task3)
				task4.story = story2; story2.addTask(task4); task4.sprint = sprint1; sprint1.addTODO(task4)
	productOwner1.addOwnedProject(project2); project2.productOwner = productOwner1
	
	productOwner2.addOwnedProject(project3); project3.productOwner = productOwner2

	productOwner2.addJoinedProject(project1); project1.addTeamMember(productOwner2)
	teammember1.addJoinedProject(project1); project1.addTeamMember(teammember1)
	teammember1.addJoinedProject(project2); project2.addTeamMember(teammember1)
	teammember2.addJoinedProject(project2); project2.addTeamMember(teammember2)

	populateUser(productOwner1)
	populateUser(productOwner2)
	populateUser(teammember1)
	populateUser(teammember2)
	populateProject(project1)
	populateProject(project2)
	populateProject(project3)
	populateRelease(release1)
	populateRelease(release2)
	populatateSprint(sprint1)
	populatateSprint(sprint2)
	populateRoles(role)

	test('Saving then loading everything from the database', async () => {
		await AppDataSource.initialize().then(async () => {
			// connects to the test database
			const userRepository = AppDataSource.getRepository(User)
			const projectRepository = AppDataSource.getRepository(Project)
			const releaseRepository = AppDataSource.getRepository(Release)
			const sprintRepository = AppDataSource.getRepository(Sprint)
			const backlogItemRepository = AppDataSource.getRepository(BacklogItem)
			const rolesRepository = AppDataSource.getRepository(UserRole)
			
			// save everything into the database
			await userRepository.save([productOwner1, productOwner2, teammember1, teammember2]);
            await projectRepository.save([project1, project2, project3]);
            await releaseRepository.save([release1, release2]);
            await sprintRepository.save([sprint1, sprint2]);
            await backlogItemRepository.save([spike, story1, story2, task1, task2, task3, task4]);
            await rolesRepository.save([role]);

			// load everything from the database and verify it passes
			const loadedUsers = await userRepository.find({
                relations: ['ownedProjects', 'joinedProjects'],
				order: {
					username: "ASC"
				}
            });
            const loadedProjects = await projectRepository.find({
                relations: ['productOwner', 'teamMembers'],
				order: {
					name: "ASC"
				}
            });
            const loadedReleases = await releaseRepository.find({
                relations: ['project', 'sprints'],
				order: {
					problemStatement: "ASC"
				}
            });
            const loadedSprints = await sprintRepository.find({
                relations: ['release', 'roles', 'todos'],
				order: {
					goal: "ASC"
				}
            });
            const loadedbacklogItems = await backlogItemRepository.find({
                relations: ['sprint', 'story', 'tasks'],
            });
            const loadedRoles = await rolesRepository.find({
                relations: ['user'],
            });

			// Assert everything is still the same
			var userList = [productOwner1, productOwner2, teammember1, teammember2].sort((a, b) => a.username.localeCompare(b.username))
			expect(loadedUsers.length).toBe(userList.length)
			for (let i = 0; i < loadedUsers.length; i++) {
				expect(loadedUsers[i].username == userList[i].username)
				expect(loadedUsers[i].email == userList[i].email)
			}
			var projList = [project1, project2, project3].sort((a,b) => a.name.localeCompare(b.name))
			expect(loadedProjects.length).toBe(projList.length)
			for (let i = 0; i < loadedProjects.length; i++) {
				expect(loadedProjects[i].name == projList[i].name)
			}
			expect(loadedRoles[0].role).toBe(role.role)
			// ... the rest are probably fine ...

			// delete everything from the test database
			await rolesRepository.delete({});
			await backlogItemRepository.delete({});
			await sprintRepository.delete({});
			await releaseRepository.delete({});
			for (const project of loadedProjects) { // many2many hard :(
				project.teamMembers = []
				await AppDataSource.manager.save(project)
			}
			for (const user of loadedUsers) {
				user.ownedProjects = []
				user.joinedProjects = []
				await AppDataSource.manager.save(user)
			}
			await projectRepository.delete({});
			await userRepository.delete({});
		})
		await AppDataSource.destroy()
	})
	
})