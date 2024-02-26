import { DataSource } from "typeorm";
import { AppDataSource, Database } from "../src/data-source";

beforeAll(async () => {
	if (AppDataSource.isInitialized)
		await AppDataSource.destroy();
})

afterAll(async () => {
	if (AppDataSource.isInitialized)
		await AppDataSource.destroy();
})

describe("Creating a database", () => {
	test("setAndGetInstance initializes the database", async () => {
		const datasouce:DataSource = await AppDataSource.initialize();
		const db = await Database.setAndGetInstance(datasouce);
		expect(db.databaseIsInitialized).toBe(true)
		expect(db.dataSourceIsInitialized).toBe(true)
	})
	test("getInstance works after initialization", async () => {
		const db = await Database.getInstance();
		expect(db.databaseIsInitialized).toBe(true)
		expect(db.dataSourceIsInitialized).toBe(true)
	})
})