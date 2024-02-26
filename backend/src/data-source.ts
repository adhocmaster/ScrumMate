import { UserRole } from "./entity/roles"
import { User } from "./entity/User"
import { Project } from "./entity/project"
import { Release } from "./entity/release"
import { Sprint } from "./entity/sprint"
import "reflect-metadata"
import { DataSource } from "typeorm"
import { Bug, Epic, Infrastructure, Spike, Story, Task, TodoItem } from "./entity/todo"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "test",
    password: "test",
    database: "test",
    synchronize: true,
    logging: true,
    entities: [User, Project, Release, UserRole, Sprint, TodoItem, Epic, Story, Task, Spike, Infrastructure, Bug],
    subscribers: [],
    migrations: [],
})

export class Database {
	private static instance: Database;
	private dataSource: DataSource | null = null

	private constructor(dataSource: DataSource) {
		this.initialize(dataSource);
	}

	public static getInstance(): Database {
		if (!Database.instance) {
			throw Error("Database is not initialized! Use setAndGetInstance first.")
		}
		return Database.instance;
	}

	public static async setAndGetInstance(dataSource: DataSource): Promise<Database> {
		if (!Database.instance) {
			if (!dataSource.isInitialized)
				throw Error("Database's DataSource is not initialized! Use setAndGetInstance first.")
			Database.instance = new Database(dataSource);
		}
		return Database.instance;
	}

	private initialize(dataSource: DataSource): void {
		try {
			this.dataSource = dataSource;
			console.log('Connected to database');
		} catch (error) {
			console.error('Error connecting to database:', error);
			throw error; // Rethrow the error to notify the caller of the failure
		}
	}

	public get databaseIsInitialized(): boolean {
		return Database.instance != null;
	}

	public get dataSourceIsInitialized(): boolean {
		return this.dataSource != null && this.dataSource.isInitialized;
	}
}
