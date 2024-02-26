import { DataSource } from "typeorm";
import { AppDataSource, Database } from "../src/data-source";
import { User } from "../src/entity/User";
import { Project } from "entity/project";

var bob: User;
var joe: User;
var plannertarium: Project;

beforeAll(async () => {
	if (AppDataSource.isInitialized)
		await AppDataSource.destroy();
})

afterAll(async () => {
	const db = await Database.getInstance();
	await db.deleteAll();
	if (AppDataSource.isInitialized)
		await AppDataSource.destroy();
})

describe("Creating a database", () => {

	test("setAndGetInstance initializes the database", async () => {
		const datasouce:DataSource = await AppDataSource.initialize();
		const db = await Database.setAndGetInstance(datasouce);
		expect(db.databaseIsInitialized).toBe(true)
		expect(db.dataSourceIsInitialized).toBe(true)
	});

	test("getInstance works after initialization", async () => {
		const db = Database.getInstance();
		expect(db.databaseIsInitialized).toBe(true)
		expect(db.dataSourceIsInitialized).toBe(true)
	});

});

describe("User methods", () => {

	test("creating a new user", async () => {
		const db = Database.getInstance();
		bob = await db.createNewUser("bob", "bob@gmail.com", "password123")
		expect(bob.username).toBe("bob")
		expect(bob.email).toBe("bob@gmail.com")
		expect(bob.password).not.toBe("password123")
		joe = await db.createNewUser("joe", "joe@gmail.com", "password123")
		expect(joe.username).toBe("joe")
		expect(joe.email).toBe("joe@gmail.com")
		expect(joe.password).not.toBe("password123")
	});

	test("not allowing duplicate username or email a new user", async () => {
		const db = Database.getInstance();
		await expect(async () => {
			await db.createNewUser("bob", "bobby@gmail.com", "password123")
		}).rejects.toThrow()
		await expect(async () => {
			await db.createNewUser("bobby", "bob@gmail.com", "password123")
		}).rejects.toThrow()
	});

	test("lookup by email", async () => {
		const db = Database.getInstance();
		expect((await db.lookupUserByEmail("bob@gmail.com")).username).toBe("bob")
	});

});

describe("Project methods", () => {

	test("creating a new project for bob", async () => {
		const db = Database.getInstance();
		plannertarium = await db.createNewProject(bob.id, "plannertarium")
		expect(plannertarium.name).toBe("plannertarium")
		expect((await db.fetchUserWithProjects(bob.id)).getOwnedProjects().length).toBe(1)
		expect((await db.fetchUserWithProjects(bob.id)).getOwnedProjects()[0].name).toBe("plannertarium")
		expect((await db.fetchUserWithProjects(bob.id)).getJoinedProjects()).toStrictEqual([])
		plannertarium = await db.lookupProjectByIdWithUsers(plannertarium.id)
		expect(plannertarium.productOwner.username).toBe("bob")
		expect(plannertarium.getTeamMembers()).toStrictEqual([])
	});

	test("joe joining plannertarium", async () => {
		const db = Database.getInstance();
		plannertarium = await db.joinProject(joe.id, plannertarium.id)
		expect(plannertarium.name).toBe("plannertarium")
		expect((await db.fetchUserWithProjects(joe.id)).getOwnedProjects()).toStrictEqual([])
		expect((await db.fetchUserWithProjects(joe.id)).getJoinedProjects().length).toBe(1)
		expect((await db.fetchUserWithProjects(joe.id)).getJoinedProjects()[0].name).toBe("plannertarium")
		plannertarium = await db.lookupProjectByIdWithUsers(plannertarium.id)
		expect(plannertarium.productOwner.username).toBe("bob")
		expect(plannertarium.getTeamMembers().length).toBe(1)
		expect(plannertarium.getTeamMembers()[0].username).toBe("joe")
	});

});