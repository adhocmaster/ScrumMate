import { DataSource } from "typeorm";
import { FakeDataSourceWrapper } from "../../src/db/fake_data_sourece";
import { User } from "../../src/entity/User";
import { Project } from "../../src/entity/project";
import { Release } from "../../src/entity/release";
import { AppDataSource } from "../../src/data-source";
import { Database } from "db/database";

var bob: User;
var joe: User;
var plannertarium: Project;
var release: Release;

beforeAll(async () => {
	if (AppDataSource.isInitialized)
		await AppDataSource.destroy();
	Database.setAndGetInstance(new FakeDataSourceWrapper())
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
		const db = Database.setAndGetInstance(datasouce);
		expect(db.databaseIsInitialized).toBe(true)
		expect(db.dataSourceIsInitialized).toBe(true)
	});

	test("getInstance works after initialization", async () => {
		const db = Database.getInstance();
		expect(db.databaseIsInitialized).toBe(true)
		expect(db.dataSourceIsInitialized).toBe(true)
	});

});
