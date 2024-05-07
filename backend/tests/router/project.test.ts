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
import { Codes } from '../../src/helpers/errors';
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
		return { app, server };
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

describe("Project API tests", () => {
	let sessionToken: string;
	test("CREATE USER", async () => {
		const body = { username: "sallyg", email: "sallys@gmail.com", password: "password123" }
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
		const body = { email: "sallys@gmail.com", password: "password123" }
		await request(app)
			.post("/api/user/login")
			.send(body)
			.expect(200)
			.then((res) => {
				expect(res.body.sessionToken).toBeDefined();
				sessionToken = res.body.sessionToken;
			});
	});

	test("Another user", async () => {
		const body = { username: "bobby", email: "bobby@gmail.com", password: "password123" }
		await request(app)
			.post("/api/user/create")
			.send(body)
			.expect(200)
			.then((res) => {
				expect(res.body.email).toEqual(body.email);
				expect(res.body.id).toBeDefined();
			});
	});

	let projectId: Number;

	test('Create project', async () => {
		const body = { name: "new Project" };
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

	test('Create Project without auth', async () => {
		const body = { name: "new Project" };
		await request(app)
			.post("/api/project")
			.send(body)
			.expect(403)
	});

	test('Update Project', async () => {
		const body = { name: "Updated Project" };
		await request(app)
			.patch(`/api/project/${projectId}`)
			.set('Cookie', [`user-auth=${sessionToken}`])
			.send(body)
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.name).toEqual('Updated Project');
				expect(res.body.id).toBeDefined();
			});
	});

	test('Update Non exisiting Project', async () => {
		const body = { name: "Updated Project" };
		await request(app)
			.patch(`/api/project/500`)
			.set('Cookie', [`user-auth=${sessionToken}`])
			.send(body)
			.expect(Codes.NotFoundError);
	});

	var revision1Id: number;
	test("Get Releases of Empty Project", async () => {
		await request(app)
			.get(`/api/project/${projectId}/releases`)
			.set('Cookie', [`user-auth=${sessionToken}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.id).toBeDefined();
				expect(res.body.releases.length).toBe(1);
				expect(res.body.releases[0].revision).toBe(1);
				expect(res.body.releases[0].backlogItemCount).toBe(0);
				revision1Id = res.body.releases[0].id;
			})
	});

	test("Get Project Data", async () => {
		await request(app)
			.get(`/api/user/projectRowData`)
			.set('Cookie', [`user-auth=${sessionToken}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.length).toBe(1);
				expect(res.body[0]).toBeDefined();
				expect(res.body[0].id).toBe(projectId);
				expect(res.body[0].name).toBe("Updated Project");
				expect(res.body[0].productOwner).toBeDefined();
				expect(res.body[0].productOwner.username).toBeDefined();
				expect(res.body[0].productOwner.username).toBe("sallyg");
				expect(res.body[0].numRevisions).toBeDefined();
				expect(res.body[0].numRevisions).toBe(1);
				expect(res.body[0].dateCreated).toBeDefined();
			})
	});

	var project2Id: number;
	test('Create another project', async () => {
		const body = { name: "new new Project" };
		await request(app)
			.post("/api/project")
			.set('Cookie', [`user-auth=${sessionToken}`])
			.send(body)
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.name).toEqual('new new Project');
				expect(res.body.id).toBeDefined();
				project2Id = res.body.id;
			});
	});

	var sprin1Id: number;
	test('New Sprint', async () => {
		const body = { "sprintNumber": 1, "startDate": "1709330028", "endDate": "1709330028", "goal": "New sprint goal" }
		await request(app)
			.post(`/api/release/${revision1Id}/sprint`)
			.set('Cookie', [`user-auth=${sessionToken}`])
			.send(body)
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.id).toBeDefined();
				sprin1Id = res.body.id;
				expect(res.body.startDate).toBeDefined();
			});
	});

	var backlogItemId: number;
	test('New Backlog Item', async () => {
		const body = {
			"userTypes": "people",
			"functionalityDescription": "backlog item",
			"reasoning": "why not",
			"acceptanceCriteria": "complete task",
			"storyPoints": 10,
			"priority": 4
		}
		await request(app)
			.post(`/api/sprint/${sprin1Id}`)
			.set('Cookie', [`user-auth=${sessionToken}`])
			.send(body)
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.id).toBeDefined();
				backlogItemId = res.body.id;
				expect(res.body.rank).toEqual(0);
			});
	});

	test('deleting project 1', async () => {
		const body = { name: "new new Project" };
		await request(app)
			.delete(`/api/project/${projectId}`)
			.set('Cookie', [`user-auth=${sessionToken}`])
			.send(body)
			.expect(200);
	});

	test('backlogItem was deleted', async () => {
		const db = Database.getInstance();
		await expect(async () => await db.getBacklogItemRepository.lookupBacklogById(backlogItemId)).rejects.toThrow('not found');
	})

	test('sprint was deleted', async () => {
		await request(app)
			.get(`/api/sprint/${sprin1Id}`)
			.set('Cookie', [`user-auth=${sessionToken}`])
			.expect(400)
			.then((res) => {
				console.log(res.body)
			})
	})

	test('release was deleted', async () => {
		await request(app)
			.get(`/api/release/${revision1Id}`)
			.set('Cookie', [`user-auth=${sessionToken}`])
			.expect(400)
	})

	test("Only project 2 left", async () => {
		await request(app)
			.get(`/api/user/projectRowData`)
			.set('Cookie', [`user-auth=${sessionToken}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.length).toBe(1);
				expect(res.body[0]).toBeDefined();
				expect(res.body[0].id).toBe(project2Id);
				expect(res.body[0].name).toBe("new new Project");
				expect(res.body[0].productOwner).toBeDefined();
				expect(res.body[0].productOwner.username).toBeDefined();
				expect(res.body[0].productOwner.username).toBe("sallyg");
				expect(res.body[0].numRevisions).toBeDefined();
				expect(res.body[0].numRevisions).toBe(1);
				expect(res.body[0].dateCreated).toBeDefined();
			})
	});


});