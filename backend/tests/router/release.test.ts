import express from 'express';
import { AppDataSource } from '../../src/data-source';
import { Database } from '../../src/db/database';
import { Release } from "../../src/entity/release"
import request from 'supertest'
import router from '../../src/router/index';
import { User } from '../../src/entity/User';
import { Project } from '../../src/entity/project';
import { UserRole } from '../../src/entity/roles';
import { Sprint } from '../../src/entity/sprint';
import { BacklogItem } from '../../src/entity/backlogItem';
import cookieParser from 'cookie-parser';
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

describe("Release API tests", () => {
	let sessionToken: string;
	var userId: number;
	test("CREATE USER", async () => {
		const body = { username: "sallyg", email: "sallys@gmail.com", password: "password123" }
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
			})
	});

	test('New Release', async () => {
		const body = { "revision": 2, "goalStatement": "here" }
		await request(app)
			.post(`/api/project/${projectId}/release`)
			.set('Cookie', [`user-auth=${sessionToken}`])
			.send(body)
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.revision).toBeDefined();
				expect(res.body.goalStatement).toBeDefined();
			});
	});

	let releaseId: Number;
	test('New Release 2', async () => {
		const body = { "goalStatement": "release 2" }
		await request(app)
			.post(`/api/project/${projectId}/release`)
			.set('Cookie', [`user-auth=${sessionToken}`])
			.send(body)
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.revision).toBeDefined();
				expect(res.body.goalStatement).toBeDefined();
				releaseId = res.body.id;
			});
	});

	test("Get Releases of project with 3 releases", async () => {
		await request(app)
			.get(`/api/project/${projectId}/releases`)
			.set('Cookie', [`user-auth=${sessionToken}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.id).toBeDefined();
				expect(res.body.releases.length).toEqual(3);
			})
	});

	test('Edit Release Plan', async () => {
		const body = { "goalStatement": "release EDITEd" }
		await request(app)
			.post(`/api/project/${projectId}/release`)
			.set('Cookie', [`user-auth=${sessionToken}`])
			.send(body)
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.revision).toBeDefined();
				expect(res.body.goalStatement).toBeDefined();
				expect(res.body.goalStatement).toEqual("release EDITEd");
			});
	});

	test("Get signability of empty release", async () => {
		await request(app)
			.get(`/api/release/${releaseId}/signingCondtion`)
			.set('Cookie', [`user-auth=${sessionToken}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBe(true);
			})
	});

	var sprintId: number;
	var sprintStoryId: number;
	var backlogStoryId: number;
	test('Create sprint and backlog items for release 3', async () => {
		const sprint1Body = { "sprintNumber": 1 }
		await request(app)
			.post(`/api/release/${releaseId}/sprint`)
			.set('Cookie', [`user-auth=${sessionToken}`])
			.send(sprint1Body)
			.expect(200)
			.then((res) => {
				// console.log(res.body)
				expect(res.body).toBeDefined();
				expect(res.body.startDate).toEqual(null);
				expect(res.body.endDate).toEqual(null);
				expect(res.body.scrumMaster).toEqual(null);
				sprintId = res.body.id;
			});

		const productBacklogItemBody = {
			"userTypes": "a",
			"functionalityDescription": "a",
			"reasoning": "a",
			"acceptanceCriteria": "a",
			"priority": 1,
		}
		await request(app)
			.post(`/api/release/${releaseId}`)
			.set('Cookie', [`user-auth=${sessionToken}`])
			.send(productBacklogItemBody)
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				sprintStoryId = res.body.id;
			});

		const sprint1BacklogItemBody = {
			"userTypes": "b",
			"functionalityDescription": "b",
			"reasoning": "b",
			"acceptanceCriteria": "b",
			"priority": 2,
		}
		await request(app)
			.post(`/api/sprint/${sprintId}`)
			.set('Cookie', [`user-auth=${sessionToken}`])
			.send(sprint1BacklogItemBody)
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				backlogStoryId = res.body.id;
			});
	});

	test("Get signability of release with an empty sprint", async () => {
		await request(app)
			.get(`/api/release/${releaseId}/signingCondtion`)
			.set('Cookie', [`user-auth=${sessionToken}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBe(false);
			})
	});

	test("Add SM to sprint 1 but still not signable", async () => {
		const body = { "scrumMasterId": userId }
		await request(app)
			.post(`/api/sprint/${sprintId}/edit`)
			.set('Cookie', [`user-auth=${sessionToken}`])
			.send(body)
			.expect(200)
			.then((res) => {
				expect(res.body.scrumMaster.id).toBe(userId);
			})

		await request(app)
			.get(`/api/release/${releaseId}/signingCondtion`)
			.set('Cookie', [`user-auth=${sessionToken}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBe(false);
			})
	});

	test("Add dates to sprint 1 but still not signable", async () => {
		const body = {
			"startDate": new Date(),
			"endDate": new Date(),
		}
		await request(app)
			.post(`/api/sprint/${sprintId}/edit`)
			.set('Cookie', [`user-auth=${sessionToken}`])
			.send(body)
			.expect(200)
			.then((res) => {
				expect(res.body.scrumMaster.id).toBe(userId);
				expect(res.body.startDate).toBeDefined();
				expect(res.body.endDate).toBeDefined();
			})

		await request(app)
			.get(`/api/release/${releaseId}/signingCondtion`)
			.set('Cookie', [`user-auth=${sessionToken}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBe(false);
			})
	});

	test("Add size to sprint story but still not signable", async () => {
		const body = {
			"storyPoints": 1,
		}
		await request(app)
			.post(`/api/story/${sprintStoryId}/edit`)
			.set('Cookie', [`user-auth=${sessionToken}`])
			.send(body)
			.expect(200)
			.then((res) => {
				expect(res.body.size).toBe(1);
			})

		await request(app)
			.get(`/api/release/${releaseId}/signingCondtion`)
			.set('Cookie', [`user-auth=${sessionToken}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBe(false);
			})
	});

	test("Add size to backlog story and is now signable", async () => {
		const body = {
			"storyPoints": 2,
		}
		await request(app)
			.post(`/api/story/${backlogStoryId}/edit`)
			.set('Cookie', [`user-auth=${sessionToken}`])
			.send(body)
			.expect(200)
			.then((res) => {
				expect(res.body.size).toBe(2);
			})

		await request(app)
			.get(`/api/release/${releaseId}/signingCondtion`)
			.set('Cookie', [`user-auth=${sessionToken}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBe(true);
			})
	});

});