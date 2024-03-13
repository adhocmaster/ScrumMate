import express from 'express';
import { AppDataSource } from '../../src/data-source';
import { Database } from '../../src/db/database';
import { Release } from "../../src/entity/release"
import request from 'supertest'
// import { newReleaseRouter } from '../src/router/release';
import router from '../../src/router/index';
import { User } from '../../src/entity/User';
import { Project } from '../../src/entity/project';
import { UserRole } from '../../src/entity/roles';
import { Sprint } from '../../src/entity/sprint';
import { BacklogItem } from '../../src/entity/backlogItem';
import { Codes, ExistingUserError } from '../../src/helpers/errors';
let app = express();
var appData: { app: any; server: any; destroy?: any; };
let server: { close: () => any; };

beforeAll(async () => {
	if (AppDataSource.isInitialized) await AppDataSource.destroy();

  	appData = await AppDataSource.initialize().then(async () => {
    Database.setAndGetInstance(AppDataSource);
    app.use(express.json())
    app.use('/api', router())
    const server = app.listen(8080)
    return {app, server};
  });
	app = appData.app;
	server = appData.server;
});

async function deleteAll() {
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
}

afterAll(async () => {
	await deleteAll();
	await AppDataSource.destroy();
	await server.close()
});

describe("User API tests", () => {

	test("CREATE USER", async () => {
		const body = {username: "sally", email: "sallys@gmail.com", password: "password123"}
		await request(app)
		.post("/api/user/create")
		.send(body)
		.expect(Codes.Success)
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

	test('Missing parameters', async () => {
		const body = {email: 'saly@gmail.com', password: "password"}
		await request(app)
		.post("/api/user/create")
		.send(body)
		.expect(400);
	});

	test("Valid login", async () => {
		const body = {email: "sallys@gmail.com", password: "password123"}
		await request(app)
		.post("/api/user/login")
		.send(body)
		.expect(200);
	});

	test('Create user with same email', async () => {
		const body = {username: "sally", email: "sallys@gmail.com", password: "password123"}
		let res;
		try {
			res = await request(app).post("/api/user/create").send(body)
		} catch(e) {
			expect(e).toBe(ExistingUserError);
		}
		expect(res).toBeUndefined;      
	});

  

});