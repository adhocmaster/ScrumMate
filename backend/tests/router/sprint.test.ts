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

describe("Sprint API tests", () => {
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
	let sprint2Id: Number;
	let sprint3Id: Number;
	let releaseId: Number;
	let backlogId: Number;

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

	test('New sprint missing data', async () => {
		const body = {"startDate": "1709330028", "endDate": "1709330028", "goal": "New sprint goal"}
		await request(app)
		.post(`/api/release/${releaseId}/sprint`)
		.set('Cookie', [`user-auth=${sessionToken}`])
		.send(body)
		.expect(400);
	});

	test('Edit Sprint', async () => {
		const body = {"goal": "New sprint goal"}
		await request(app)
		.post(`/api/sprint/${sprintId}/edit`)
		.set('Cookie', [`user-auth=${sessionToken}`])
		.send(body)
		.expect(200)
		.then((res) => {
			expect(res.body).toBeDefined();
			expect(res.body.goal).toBeDefined();
			expect(res.body.goal).toEqual("New sprint goal")
			expect(res.body.sprintNumber);

		});
	});

	test('More Sprints', async () => {
		const body = {"sprintNumber": 2, "startDate": "03/24/2023", "endDate": "03/25/2023", "goal": "New new sprint goal"}
		await request(app)
		.post(`/api/release/${releaseId}/sprint`)
		.set('Cookie', [`user-auth=${sessionToken}`])
		.send(body)
		.expect(200)
		.then((res) => {
			expect(res.body).toBeDefined();
			expect(res.body.id).toBeDefined();
			sprint2Id = res.body.id;
			expect(res.body.startDate).toBeDefined();
		});
		const body2 = {"sprintNumber": 3, "startDate": "03/25/2023", "endDate": "03/26/2023", "goal": "New new new sprint goal"}
		await request(app)
		.post(`/api/release/${releaseId}/sprint`)
		.set('Cookie', [`user-auth=${sessionToken}`])
		.send(body2)
		.expect(200)
		.then((res) => {
			expect(res.body).toBeDefined();
			expect(res.body.id).toBeDefined();
			sprint3Id = res.body.id;
			expect(res.body.startDate).toBeDefined();
		});
	});

	test("The order of sprints is ascending when getting sprints", async () => {
		await request(app)
		.get(`/api/release/${releaseId}/sprints`)
		.set('Cookie', [`user-auth=${sessionToken}`])
		.expect(200)
		.then((res) => {
			expect(res.body).toBeDefined();
			expect(res.body[0].id).toBe(sprintId);
			expect(res.body[1].id).toBe(sprint2Id);
			expect(res.body[2].id).toBe(sprint3Id);
		});
	});

	test("Reorder sprints to be 3, 1, 2", async () => {
		await request(app)
		.post(`/api/release/${releaseId}/reorder`)
		.set('Cookie', [`user-auth=${sessionToken}`])
		.send({
			sprintStartIndex: 2,
            sprintEndIndex: 0
		})
		.expect(200)
		.then((res) => {
			expect(res.body).toBeDefined();
			expect(res.body[0].id).toBe(sprint3Id);
			expect(res.body[0].sprintNumber).toBe(1);
			expect(res.body[1].id).toBe(sprintId);
			expect(res.body[1].sprintNumber).toBe(2);
			expect(res.body[2].id).toBe(sprint2Id);
			expect(res.body[2].sprintNumber).toBe(3);
		});
	});

	test("The new order of sprints is saved", async () => {
		await request(app)
		.get(`/api/release/${releaseId}/sprints`)
		.set('Cookie', [`user-auth=${sessionToken}`])
		.expect(200)
		.then((res) => {
			expect(res.body).toBeDefined();
			expect(res.body.length).toBe(3)
			expect(res.body[0].id).toBe(sprint3Id);
			expect(res.body[0].sprintNumber).toBe(1);
			expect(res.body[1].id).toBe(sprintId);
			expect(res.body[1].sprintNumber).toBe(2);
			expect(res.body[2].id).toBe(sprint2Id);
			expect(res.body[2].sprintNumber).toBe(3);
		});
	});

	test("Sprints still have relation to the release", async () => {
		await request(app)
		.get(`/api/sprint/${sprintId}`)
		.set('Cookie', [`user-auth=${sessionToken}`])
		.expect(200)
		.then((res) => {
			expect(res.body).toBeDefined();
			expect(res.body.id).toBe(sprintId);
			expect(res.body.sprintNumber).toBe(2);
			expect(res.body.release.id).toBe(releaseId);
		});
	});

	test("Deleting a middle sprint so its just 3 2", async () => {
		await request(app)
		.delete(`/api/sprint/${sprintId}`)
		.set('Cookie', [`user-auth=${sessionToken}`])
		.expect(200)
		.then((res) => {
			expect(res.body).toBeDefined();
			expect(res.body.length).toBe(2);
			expect(res.body[0].id).toBe(sprint3Id);
			expect(res.body[1].id).toBe(sprint2Id);
		});
	});

	test("The sprint is also missing from the release", async () => {
		await request(app)
		.get(`/api/release/${releaseId}/sprints`)
		.set('Cookie', [`user-auth=${sessionToken}`])
		.expect(200)
		.then((res) => {
			expect(res.body).toBeDefined();
			expect(res.body.length).toBe(2)
			expect(res.body[0].id).toBe(sprint3Id);
			expect(res.body[0].sprintNumber).toBe(1);
			expect(res.body[1].id).toBe(sprint2Id);
			expect(res.body[1].sprintNumber).toBe(2);
		});
	});

	test('Adding new story to sprint', async () => {
		const body = {
			"userTypes": "any user",
			"functionalityDescription": "backlog item",
			"reasoning": "why not",
			"acceptanceCriteria": "complete task",
			"storyPoints": 10,
			"priority": 4}
		await request(app)
		.post(`/api/sprint/${sprint3Id}`)
		.set('Cookie', [`user-auth=${sessionToken}`])
		.send(body)
		.expect(200)
		.then((res) => {
			expect(res.body).toBeDefined();
			expect(res.body.id).toBeDefined();
			backlogId = res.body.id;
		});
	});

	test("Can delete a sprint with a story", async () => {
		await request(app)
		.delete(`/api/sprint/${sprint3Id}`)
		.set('Cookie', [`user-auth=${sessionToken}`])
		.expect(200)
		.then((res) => {
			expect(res.body).toBeDefined();
			expect(res.body.length).toBe(1);
			expect(res.body[0].id).toBe(sprint2Id);
		});
	});

	test("The story from the deleted sprint is in the backlog", async () => {
		await request(app)
		.get(`/api/release/${releaseId}/backlog`)
		.set('Cookie', [`user-auth=${sessionToken}`])
		.expect(200)
		.then((res) => {
			expect(res.body).toBeDefined();
			expect(res.body.backlog.length).toBe(1)
			expect(res.body.backlog[0].id).toBe(backlogId)
		});
	});

});