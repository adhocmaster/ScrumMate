import { DataSource } from "typeorm";
import { AppDataSource, Database } from "../src/data-source";
import { User } from "../src/entity/User";

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
		const db = await Database.getInstance();
		expect(db.databaseIsInitialized).toBe(true)
		expect(db.dataSourceIsInitialized).toBe(true)
	});

});

describe("User methods", () => {

	test("creating a new user", async () => {
		const db = await Database.getInstance();
		const bob: User = await db.createNewUser("Bob", "bob@gmail.com", "password123")
		expect(bob.username).toBe("Bob")
		expect(bob.email).toBe("bob@gmail.com")
		expect(bob.password).not.toBe("password123")
	})

	test("cant have duplicate username or email a new user", async () => {
		const db = await Database.getInstance();
		await expect(async () => {
			await db.createNewUser("Bob", "bobby@gmail.com", "password123")
		}).rejects.toThrow()
		await expect(async () => {
			await db.createNewUser("Bobby", "bob@gmail.com", "password123")
		}).rejects.toThrow()
	})

});