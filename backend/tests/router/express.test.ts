import express from 'express';
import { AppDataSource, Database } from '../../src/data-source';
import { Release } from "../../src/entity/release"
import request from 'supertest'
// import { newReleaseRouter } from '../src/router/release';
import user from '../../src/router/user';
import project from '../../src/router/project';
import { User } from '../../src/entity/User';
import { Project } from '../../src/entity/project';
import { UserRole } from '../../src/entity/roles';
import { Sprint } from '../../src/entity/sprint';
import { BacklogItem } from '../../src/entity/backlogItem';

let app = express();
var appData: { app: any; server: any; destroy?: any; };
let server;

beforeAll(async () => {
	if (AppDataSource.isInitialized)
		await AppDataSource.destroy();
	appData = await AppDataSource.initialize().then(async () => {
		app.use(express.json())
		// app.use(newReleaseRouter);
		user(app)
		project(app)
		const server = app.listen(8080)
		return {app, server};
	  });;
	app = appData.app;
	server = appData.server;

	Database.setAndGetInstance(AppDataSource)
})

afterAll(async () => {
	const userRepository = AppDataSource.getRepository(User)
	const projectRepository = AppDataSource.getRepository(Project)
	const releaseRepository = AppDataSource.getRepository(Release)
	const sprintRepository = AppDataSource.getRepository(Sprint)
	const backlogItemRepository = AppDataSource.getRepository(BacklogItem)
	const rolesRepository = AppDataSource.getRepository(UserRole)

	await rolesRepository.delete({});
	await backlogItemRepository.delete({});
	await sprintRepository.delete({});
	await releaseRepository.delete({});
	await projectRepository.delete({});
	await userRepository.delete({});
	await AppDataSource.destroy();
});

describe("User API tests", () => {

	test("CREATE USER", async () => {
		const body = {username: "sally", email: "sallys@gmail.com", password: "password123"}
		await request(app)
		.post("/api/user/create")
		.send(body)
		.expect(200)
		.then((res) => {
			expect(res.body.email).toEqual(body.email);
			expect(res.body.id).toBeDefined();
		});
	});

	test("Invalid password login", async () => {
		const body = {email: "sallys@gmail.com", password: "wrongPassword"}
		await request(app)
		.post("/api/user/login")
		.send(body)
		.expect(403);
	});

	test("Valid login", async () => {
		const body = {email: "sallys@gmail.com", password: "password123"}
		await request(app)
		.post("/api/user/login")
		.send(body)
		.expect(200);
	});

});