import express from 'express';
import { AppDataSource } from '../../src/data-source';
import { Database } from '../../src/db/database';
import { Release } from "../../src/entity/release"
import request from 'supertest'
import router from '../../src/router/index';
// import { newReleaseRouter } from '../src/router/release';

import { User } from '../../src/entity/User';
import { Project } from '../../src/entity/project';
import { UserRole } from '../../src/entity/roles';
import { Sprint } from '../../src/entity/sprint';
import { BacklogItem } from '../../src/entity/backlogItem';
import cookieParser from 'cookie-parser';
import {Codes} from '../../src/helpers/errors';
let app = express();
var appData: { app: any; server: any; destroy?: any; };
let server: { close: () => any; };

beforeAll(async () => {
	  if (AppDataSource.isInitialized) await deleteAll();
	  appData = await AppDataSource.initialize().then(async () => {
      Database.setAndGetInstance(AppDataSource);
      app.use(express.json())
      app.use(cookieParser());

      app.use('/api', router());
      // app.use(newReleaseRouter);
      const server = app.listen(8080) 
      return {app, server};
	  });
	app = appData.app;
	server = appData.server;
})
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

let userId: Number;

describe("Release API tests", () => {
  let sessionToken: string;
	test("CREATE USER", async () => {
		const body = {username: "sallyg", email: "sallys@gmail.com", password: "password123"}
		await request(app)
		.post("/api/user/create")
		.send(body)
		.expect(200)
		.then((res) => {
			expect(res.body.email).toEqual(body.email);
			expect(res.body.id).toBeDefined();
			userId = res.body.id;
		});
	});

	test("Valid login", async () => {
		const body = {email: "sallys@gmail.com", password: "password123"}
		await request(app)
		.post("/api/user/login")
		.send(body)
		.expect(200)
		.then((res) => {
			expect(res.body.sessionToken).toBeDefined();
			sessionToken = res.body.sessionToken;
		});
	});

	let projectId: Number;
	let sprintId: Number;
	let releaseId: Number;

	test('Create project', async () => {
		const body = {name: "new Project"};
		await request(app)
		.post("/api/project")
		.set('Cookie', [`user-auth=${sessionToken}`])
		.send(body)
		.expect(200)
		.then((res) => {
			expect(res.body).toBeDefined();
			expect(res.body.name).toEqual('new Project'); 
			expect(res.body.id).toBeDefined();
			projectId = res.body.id;
		});
	});

	test('New Release', async () => {
		const body = {"revision": 2, "goalStatement": "here"}
		await request(app)
		.post(`/api/project/${projectId}/release`)
		.set('Cookie', [`user-auth=${sessionToken}`])
		.send(body)
		.expect(200)
		.then((res) => {
			expect(res.body).toBeDefined();
			expect(res.body.revision).toBeDefined();
			expect(res.body.id).toBeDefined();
			releaseId = res.body.id;
			expect(res.body.goalStatement).toBeDefined();
		});
	});

	test('New Sprint', async () => {
		const body = {"sprintNumber": 1, "startDate": "03/24/2023", "endDate": "03/24/2023", "goal": "New sprint goal"}
		await request(app)
		.post(`/api/release/${releaseId}/sprint`)
		.set('Cookie', [`user-auth=${sessionToken}`])
		.send(body)
		.expect(200)
		.then((res) => {
			expect(res.body).toBeDefined();
			expect(res.body.id).toBeDefined();
			sprintId = res.body.id;
			expect(res.body.startDate).toBeDefined();

		});
	});

	let roleId: Number;
	test('New Role', async () => {
		const body = {"role": "Master"}
		await request(app)
		.post(`/api/user/${userId}/sprint/${sprintId}`)
		.set('Cookie', [`user-auth=${sessionToken}`])
		.send(body)
		.expect(200)
		.then((res) => {
			expect(res.body).toBeDefined();
			expect(res.body.id).toBeDefined();
			roleId = res.body.id;
		});
	});

	test('Edit role', async () => {
		const body = {"role": "None"}
		await request(app)
		.post(`/api//role/${roleId}/edit/${userId}`)
		.set('Cookie', [`user-auth=${sessionToken}`])
		.send(body)
		.expect(200)
		.then((res) => {
			expect(res.body).toBeDefined();
			expect(res.body.id).toBeDefined();
			expect(res.body.role).toEqual("None");
		});
	});
});