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

describe("Invite API tests", () => {
	let sessionToken1: string;
	let sallyId: number;
	test("CREATE USER", async () => {
		const body = { username: "sallyg", email: "sallys@gmail.com", password: "password123" }
		await request(app)
			.post("/api/user/create")
			.send(body)
			.expect(200)
			.then((res) => {
				expect(res.body.email).toEqual(body.email);
				expect(res.body.id).toBeDefined();
				sallyId = res.body.id;
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
				sessionToken1 = res.body.sessionToken;
			});
	});

	let sessionToken2: string;
	let bobbyId: number;
	test("Another user", async () => {
		const body = { username: "bobby", email: "bobby@gmail.com", password: "password123" }
		await request(app)
			.post("/api/user/create")
			.send(body)
			.expect(200)
			.then((res) => {
				expect(res.body.email).toEqual(body.email);
				expect(res.body.id).toBeDefined();
				bobbyId = res.body.id;
			});
	});

	test("new valid login", async () => {
		const body = { email: "bobby@gmail.com", password: "password123" }
		await request(app)
			.post("/api/user/login")
			.send(body)
			.expect(200)
			.then((res) => {
				expect(res.body.sessionToken).toBeDefined();
				sessionToken2 = res.body.sessionToken;
			});
	});

	let projectId: number;
	test('Create project', async () => {
		const body = { name: "new Project" };
		await request(app)
			.post("/api/project")
			.set('Cookie', [`user-auth=${sessionToken1}`])
			.send(body)
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.name).toEqual('new Project');
				expect(res.body.id).toBeDefined();
				projectId = res.body.id;
			});
	});

	test('Get project initial members', async () => {
		await request(app)
			.get(`/api/project/${projectId}/getMembers`)
			.set('Cookie', [`user-auth=${sessionToken1}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.length).toBe(3);
				expect(res.body[0].length).toBe(0);
				expect(res.body[1].id).toBe(sallyId);
				expect(res.body[2].length).toBe(0);
			});
	});

	// Now testing planning poker
	let release1Id: number;
	let sprintId: number;
	test('New Sprint', async () => {
		const db = Database.getInstance();
		const projectWithReleases = await db.getProjectRepository.fetchProjectWithReleases(projectId);
		release1Id = projectWithReleases.releases[0].id;

		const body = { "sprintNumber": 1, "startDate": "1709330028", "endDate": "1709330028", "goal": "New sprint goal" }
		await request(app)
			.post(`/api/release/${release1Id}/sprint`)
			.set('Cookie', [`user-auth=${sessionToken1}`])
			.send(body)
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.id).toBeDefined();
				sprintId = res.body.id;
				expect(res.body.startDate).toBeDefined();
			});
	});

	let backlogId1: Number;
	test('First Backlog Item goes into sprint 1', async () => {
		const body = {
			"userTypes": "people",
			"functionalityDescription": "backlog item",
			"reasoning": "why not",
			"acceptanceCriteria": "complete task",
			"storyPoints": 10,
			"priority": 4
		}
		await request(app)
			.post(`/api/sprint/${sprintId}`)
			.set('Cookie', [`user-auth=${sessionToken1}`])
			.send(body)
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.id).toBeDefined();
				backlogId1 = res.body.id;
				expect(res.body.rank).toEqual(0);
			});
	});

	let backlogId2: Number;
	test('Second Backlog Item goes into backlog of release 1', async () => {
		const body = {
			"userTypes": "people",
			"functionalityDescription": "backlog item",
			"reasoning": "why not",
			"acceptanceCriteria": "complete task",
			"storyPoints": 11,
			"priority": 4
		}
		await request(app)
			.post(`/api/release/${release1Id}`)
			.set('Cookie', [`user-auth=${sessionToken1}`])
			.send(body)
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.id).toBeDefined();
				backlogId2 = res.body.id;
				expect(res.body.rank).toEqual(0);
			});
	});

	test('First backlogItem Poker is empty for sally', async () => {
		await request(app)
			.get(`/api/backlogItem/${backlogId1}/poker`)
			.set('Cookie', [`user-auth=${sessionToken1}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.pokerIsOver).toEqual(false);
				expect(res.body.userEstimate).toEqual(["", false]);
				expect(res.body.othersEstimates).toEqual([]);
				expect(res.body.size).toEqual(10);
				expect(res.body.rank).toEqual(0);
			});
	});

	test('Second backlogItem Poker is empty for sally', async () => {
		await request(app)
			.get(`/api/backlogItem/${backlogId2}/poker`)
			.set('Cookie', [`user-auth=${sessionToken1}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.pokerIsOver).toEqual(false);
				expect(res.body.userEstimate).toEqual(["", false]);
				expect(res.body.othersEstimates).toEqual([]);
				expect(res.body.size).toEqual(11);
				expect(res.body.rank).toEqual(0);
			});
	});

	test('Sally estimates the first item', async () => {
		const body = {
			"estimate": "1",
		}
		await request(app)
			.post(`/api/backlogItem/${backlogId1}/poker`)
			.set('Cookie', [`user-auth=${sessionToken1}`])
			.send(body)
			.expect(200)
	});

	test('Sally estimates the second item', async () => {
		const body = {
			"estimate": "2",
		}
		await request(app)
			.post(`/api/backlogItem/${backlogId2}/poker`)
			.set('Cookie', [`user-auth=${sessionToken1}`])
			.send(body)
			.expect(200)
	});

	test('First backlogItem Poker is done and has estimate 1 from sally', async () => {
		await request(app)
			.get(`/api/backlogItem/${backlogId1}/poker`)
			.set('Cookie', [`user-auth=${sessionToken1}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.pokerIsOver).toEqual(true);
				expect(res.body.userEstimate).toEqual(["1", true]);
				expect(res.body.othersEstimates).toEqual([]);
				expect(res.body.size).toEqual(1);
				expect(res.body.rank).toEqual(0);
			});
	});

	test('Second backlogItem Poker is done and has estimate 2 from sally', async () => {
		await request(app)
			.get(`/api/backlogItem/${backlogId2}/poker`)
			.set('Cookie', [`user-auth=${sessionToken1}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.pokerIsOver).toEqual(true);
				expect(res.body.userEstimate).toEqual(["2", true]);
				expect(res.body.othersEstimates).toEqual([]);
				expect(res.body.size).toEqual(2);
				expect(res.body.rank).toEqual(0);
			});
	});

	test('Sally reestimates the first item to 2', async () => {
		const body = {
			"estimate": "2",
		}
		await request(app)
			.post(`/api/backlogItem/${backlogId1}/poker`)
			.set('Cookie', [`user-auth=${sessionToken1}`])
			.send(body)
			.expect(200)
	});

	test('Sally reestimates the second item to 3', async () => {
		const body = {
			"estimate": "3",
		}
		await request(app)
			.post(`/api/backlogItem/${backlogId2}/poker`)
			.set('Cookie', [`user-auth=${sessionToken1}`])
			.send(body)
			.expect(200)
	});

	test('First backlogItem Poker is now 2', async () => {
		await request(app)
			.get(`/api/backlogItem/${backlogId1}/poker`)
			.set('Cookie', [`user-auth=${sessionToken1}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.pokerIsOver).toEqual(true);
				expect(res.body.userEstimate).toEqual(["2", true]);
				expect(res.body.othersEstimates).toEqual([]);
				expect(res.body.size).toEqual(2);
				expect(res.body.rank).toEqual(0);
			});
	});

	test('Second backlogItem Poker is now 3', async () => {
		await request(app)
			.get(`/api/backlogItem/${backlogId2}/poker`)
			.set('Cookie', [`user-auth=${sessionToken1}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.pokerIsOver).toEqual(true);
				expect(res.body.userEstimate).toEqual(["3", true]);
				expect(res.body.othersEstimates).toEqual([]);
				expect(res.body.size).toEqual(3);
				expect(res.body.rank).toEqual(0);
			});
	});

	test('Get bobby initial invites', async () => {
		await request(app)
			.get(`/api/user/getInvites`)
			.set('Cookie', [`user-auth=${sessionToken2}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.length).toBe(0);
			});
	});

	test('Send invite to bobby', async () => {
		await request(app)
			.post(`/api/project/${projectId}/invite/bobby@gmail.com`)
			.set('Cookie', [`user-auth=${sessionToken1}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.length).toBe(3);
				expect(res.body[0].length).toBe(1);
				expect(res.body[0][0].id).toBe(bobbyId);
				expect(res.body[1].id).toBe(sallyId);
				expect(res.body[2].length).toBe(0);
			});
	});

	test('Project has the invite', async () => {
		await request(app)
			.get(`/api/project/${projectId}/getMembers`)
			.set('Cookie', [`user-auth=${sessionToken1}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.length).toBe(3);
				expect(res.body[0].length).toBe(1);
				expect(res.body[0][0].id).toBe(bobbyId);
				expect(res.body[1].id).toBe(sallyId);
				expect(res.body[2].length).toBe(0);
			});
	});

	test('bobby sees the invite', async () => {
		await request(app)
			.get(`/api/user/getInvites`)
			.set('Cookie', [`user-auth=${sessionToken2}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.length).toBe(1);
				expect(res.body[0].id).toBe(projectId);
			});
	});

	test('Bobby accepts invite', async () => {
		await request(app)
			.post(`/api/user/acceptInvite/${projectId}`)
			.set('Cookie', [`user-auth=${sessionToken2}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.length).toBe(2);
				expect(res.body[0].length).toBe(0);
				expect(res.body[1].id).toBe(projectId);
			});
	});

	test('Updated Project Members', async () => {
		await request(app)
			.get(`/api/project/${projectId}/getMembers`)
			.set('Cookie', [`user-auth=${sessionToken1}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.length).toBe(3);
				expect(res.body[0].length).toBe(0);
				expect(res.body[1].id).toBe(sallyId);
				expect(res.body[2].length).toBe(1);
				expect(res.body[2][0].id).toBe(bobbyId);
			});
	});

	test('Updated invitations', async () => {
		await request(app)
			.get(`/api/user/getInvites`)
			.set('Cookie', [`user-auth=${sessionToken2}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.length).toBe(0);
			});
	});

	// Poker again
	test('Sally reestimates the first item to 3 after bobby joins', async () => {
		const body = {
			"estimate": "3",
		}
		await request(app)
			.post(`/api/backlogItem/${backlogId1}/poker`)
			.set('Cookie', [`user-auth=${sessionToken1}`])
			.send(body)
			.expect(200)
	});

	test('Sally reestimates the second item to 4 after bobby joins', async () => {
		const body = {
			"estimate": "4",
		}
		await request(app)
			.post(`/api/backlogItem/${backlogId2}/poker`)
			.set('Cookie', [`user-auth=${sessionToken1}`])
			.send(body)
			.expect(200)
	});

	test('First backlogItem Poker is updated for sally', async () => {
		await request(app)
			.get(`/api/backlogItem/${backlogId1}/poker`)
			.set('Cookie', [`user-auth=${sessionToken1}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.pokerIsOver).toEqual(false);
				expect(res.body.userEstimate).toEqual(["3", true]);
				expect(res.body.othersEstimates).toEqual([["", false]]);
				expect(res.body.size).toEqual(2);
				expect(res.body.rank).toEqual(0);
			});
	});

	test('Second backlogItem Poker is updated for sally', async () => {
		await request(app)
			.get(`/api/backlogItem/${backlogId2}/poker`)
			.set('Cookie', [`user-auth=${sessionToken1}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.pokerIsOver).toEqual(false);
				expect(res.body.userEstimate).toEqual(["4", true]);
				expect(res.body.othersEstimates).toEqual([["", false]]);
				expect(res.body.size).toEqual(3);
				expect(res.body.rank).toEqual(0);
			});
	});

	test('Bobby estimates the first item at 1', async () => {
		const body = {
			"estimate": "1",
		}
		await request(app)
			.post(`/api/backlogItem/${backlogId1}/poker`)
			.set('Cookie', [`user-auth=${sessionToken2}`])
			.send(body)
			.expect(200)
	});

	test('Bobby estimates the second item at 2', async () => {
		const body = {
			"estimate": "2",
		}
		await request(app)
			.post(`/api/backlogItem/${backlogId2}/poker`)
			.set('Cookie', [`user-auth=${sessionToken2}`])
			.send(body)
			.expect(200)
	});

	test('Poker moved to next round. First backlogItem Poker is correct for Bobby', async () => {
		await request(app)
			.get(`/api/backlogItem/${backlogId1}/poker`)
			.set('Cookie', [`user-auth=${sessionToken2}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.pokerIsOver).toEqual(false);
				expect(res.body.userEstimate).toEqual(["1", false]);
				expect(res.body.othersEstimates).toEqual([["3", false]]);
				expect(res.body.size).toEqual(2);
				expect(res.body.rank).toEqual(0);
			});
	});

	test('Poker moved to next round. Second backlogItem Poker is correct for Bobby', async () => {
		await request(app)
			.get(`/api/backlogItem/${backlogId2}/poker`)
			.set('Cookie', [`user-auth=${sessionToken2}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.pokerIsOver).toEqual(false);
				expect(res.body.userEstimate).toEqual(["2", false]);
				expect(res.body.othersEstimates).toEqual([["4", false]]);
				expect(res.body.size).toEqual(3);
				expect(res.body.rank).toEqual(0);
			});
	});

	test('First backlogItem Poker is correct for Sally', async () => {
		await request(app)
			.get(`/api/backlogItem/${backlogId1}/poker`)
			.set('Cookie', [`user-auth=${sessionToken1}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.pokerIsOver).toEqual(false);
				expect(res.body.userEstimate).toEqual(["3", false]);
				expect(res.body.othersEstimates).toEqual([["1", false]]);
				expect(res.body.size).toEqual(2);
				expect(res.body.rank).toEqual(0);
			});
	});

	test('Second backlogItem Poker is correct for Sally', async () => {
		await request(app)
			.get(`/api/backlogItem/${backlogId2}/poker`)
			.set('Cookie', [`user-auth=${sessionToken1}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.pokerIsOver).toEqual(false);
				expect(res.body.userEstimate).toEqual(["4", false]);
				expect(res.body.othersEstimates).toEqual([["2", false]]);
				expect(res.body.size).toEqual(3);
				expect(res.body.rank).toEqual(0);
			});
	});

	test('Bobby reestimates the first item at 1', async () => {
		const body = {
			"estimate": "1",
		}
		await request(app)
			.post(`/api/backlogItem/${backlogId1}/poker`)
			.set('Cookie', [`user-auth=${sessionToken2}`])
			.send(body)
			.expect(200)
	});

	test('Bobby reestimates the second item at 2', async () => {
		const body = {
			"estimate": "2",
		}
		await request(app)
			.post(`/api/backlogItem/${backlogId2}/poker`)
			.set('Cookie', [`user-auth=${sessionToken2}`])
			.send(body)
			.expect(200)
	});

	test('First backlogItem Poker hides Bobbys new estimate for Sally', async () => {
		await request(app)
			.get(`/api/backlogItem/${backlogId1}/poker`)
			.set('Cookie', [`user-auth=${sessionToken1}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.pokerIsOver).toEqual(false);
				expect(res.body.userEstimate).toEqual(["3", false]);
				expect(res.body.othersEstimates).toEqual([["1", true]]);
				expect(res.body.size).toEqual(2);
				expect(res.body.rank).toEqual(0);
			});
	});

	test('Second backlogItem Poker hides Bobbys new estimate for Sally', async () => {
		await request(app)
			.get(`/api/backlogItem/${backlogId2}/poker`)
			.set('Cookie', [`user-auth=${sessionToken1}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.pokerIsOver).toEqual(false);
				expect(res.body.userEstimate).toEqual(["4", false]);
				expect(res.body.othersEstimates).toEqual([["2", true]]);
				expect(res.body.size).toEqual(3);
				expect(res.body.rank).toEqual(0);
			});
	});

	test('Sally reestimates the first item to 1 after bobby', async () => {
		const body = {
			"estimate": "1",
		}
		await request(app)
			.post(`/api/backlogItem/${backlogId1}/poker`)
			.set('Cookie', [`user-auth=${sessionToken1}`])
			.send(body)
			.expect(200)
	});

	test('Sally reestimates the second item to 2 after bobby', async () => {
		const body = {
			"estimate": "2",
		}
		await request(app)
			.post(`/api/backlogItem/${backlogId2}/poker`)
			.set('Cookie', [`user-auth=${sessionToken1}`])
			.send(body)
			.expect(200)
	});

	test('First backlogItem Poker is done', async () => {
		await request(app)
			.get(`/api/backlogItem/${backlogId1}/poker`)
			.set('Cookie', [`user-auth=${sessionToken1}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.pokerIsOver).toEqual(true);
				expect(res.body.userEstimate).toEqual(["1", true]);
				expect(res.body.othersEstimates).toEqual([["1", true]]);
				expect(res.body.size).toEqual(1);
				expect(res.body.rank).toEqual(0);
			});
	});

	test('Second backlogItem Poker is done', async () => {
		await request(app)
			.get(`/api/backlogItem/${backlogId2}/poker`)
			.set('Cookie', [`user-auth=${sessionToken1}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.pokerIsOver).toEqual(true);
				expect(res.body.userEstimate).toEqual(["2", true]);
				expect(res.body.othersEstimates).toEqual([["2", true]]);
				expect(res.body.size).toEqual(2);
				expect(res.body.rank).toEqual(0);
			});
	});

	let sessionToken3: string;
	let joeId: number;
	test("rejected user", async () => {
		const body = { username: "joe", email: "joe@gmail.com", password: "password123" }
		await request(app)
			.post("/api/user/create")
			.send(body)
			.expect(200)
			.then((res) => {
				expect(res.body.email).toEqual(body.email);
				expect(res.body.id).toBeDefined();
				joeId = res.body.id;
			});
	});

	test("joe login", async () => {
		const body = { email: "joe@gmail.com", password: "password123" }
		await request(app)
			.post("/api/user/login")
			.send(body)
			.expect(200)
			.then((res) => {
				expect(res.body.sessionToken).toBeDefined();
				sessionToken3 = res.body.sessionToken;
			});
	});

	test('Send invite to joe', async () => {
		await request(app)
			.post(`/api/project/${projectId}/invite/joe@gmail.com`)
			.set('Cookie', [`user-auth=${sessionToken1}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.length).toBe(3);
				expect(res.body[0].length).toBe(1);
				expect(res.body[0][0].id).toBe(joeId);
				expect(res.body[1].id).toBe(sallyId);
				expect(res.body[2].length).toBe(1);
			});
	});

	test('Project has joe invite', async () => {
		await request(app)
			.get(`/api/project/${projectId}/getMembers`)
			.set('Cookie', [`user-auth=${sessionToken1}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.length).toBe(3);
				expect(res.body[0].length).toBe(1);
				expect(res.body[0][0].id).toBe(joeId);
				expect(res.body[1].id).toBe(sallyId);
				expect(res.body[2].length).toBe(1);
			});
	});

	test('joe sees the invite', async () => {
		await request(app)
			.get(`/api/user/getInvites`)
			.set('Cookie', [`user-auth=${sessionToken3}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.length).toBe(1);
				expect(res.body[0].id).toBe(projectId);
			});
	});

	test('joe rejects invite', async () => {
		await request(app)
			.post(`/api/user/rejectInvite/${projectId}`)
			.set('Cookie', [`user-auth=${sessionToken3}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.length).toBe(0);
			});
	});

	test('no new Project Members', async () => {
		await request(app)
			.get(`/api/project/${projectId}/getMembers`)
			.set('Cookie', [`user-auth=${sessionToken1}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.length).toBe(3);
				expect(res.body[0].length).toBe(0);
				expect(res.body[1].id).toBe(sallyId);
				expect(res.body[2].length).toBe(1);
				expect(res.body[2][0].id).toBe(bobbyId);
			});
	});

	test('no more joe invitations', async () => {
		await request(app)
			.get(`/api/user/getInvites`)
			.set('Cookie', [`user-auth=${sessionToken3}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.length).toBe(0);
			});
	});

	test('Send another invite to joe', async () => {
		await request(app)
			.post(`/api/project/${projectId}/invite/joe@gmail.com`)
			.set('Cookie', [`user-auth=${sessionToken1}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.length).toBe(3);
				expect(res.body[0].length).toBe(1);
				expect(res.body[0][0].id).toBe(joeId);
				expect(res.body[1].id).toBe(sallyId);
				expect(res.body[2].length).toBe(1);
			});
	});

	test('Project has joe invite again', async () => {
		await request(app)
			.get(`/api/project/${projectId}/getMembers`)
			.set('Cookie', [`user-auth=${sessionToken1}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.length).toBe(3);
				expect(res.body[0].length).toBe(1);
				expect(res.body[0][0].id).toBe(joeId);
				expect(res.body[1].id).toBe(sallyId);
				expect(res.body[2].length).toBe(1);
			});
	});

	test('joe sees the invite again', async () => {
		await request(app)
			.get(`/api/user/getInvites`)
			.set('Cookie', [`user-auth=${sessionToken3}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.length).toBe(1);
				expect(res.body[0].id).toBe(projectId);
			});
	});

	test('project cancels invite', async () => {
		await request(app)
			.post(`/api/project/${projectId}/cancelInvite/${joeId}`)
			.set('Cookie', [`user-auth=${sessionToken3}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.length).toBe(3);
				expect(res.body[0].length).toBe(0);
				expect(res.body[1].id).toBe(sallyId);
				expect(res.body[2].length).toBe(1);
				expect(res.body[2][0].id).toBe(bobbyId);
			});
	});

	test('no new Project Members again', async () => {
		await request(app)
			.get(`/api/project/${projectId}/getMembers`)
			.set('Cookie', [`user-auth=${sessionToken1}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.length).toBe(3);
				expect(res.body[0].length).toBe(0);
				expect(res.body[1].id).toBe(sallyId);
				expect(res.body[2].length).toBe(1);
				expect(res.body[2][0].id).toBe(bobbyId);
			});
	});

	test('no more joe invitations again', async () => {
		await request(app)
			.get(`/api/user/getInvites`)
			.set('Cookie', [`user-auth=${sessionToken3}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.length).toBe(0);
			});
	});

	test('Send an invite to sally', async () => {
		await request(app)
			.post(`/api/project/${projectId}/invite/sallys@gmail.com`)
			.set('Cookie', [`user-auth=${sessionToken1}`])
			.expect(Codes.ExistingUserError);
	});

	test('Send an invite to bobby', async () => {
		await request(app)
			.post(`/api/project/${projectId}/invite/bobby@gmail.com`)
			.set('Cookie', [`user-auth=${sessionToken1}`])
			.expect(Codes.ExistingUserError);
	});

	// now testing signing statuses with joins/leaves
	test("getting signatures for unsigned release revision", async () => {

		await request(app)
			.get(`/api/release/${release1Id}/signatures`)
			.set('Cookie', [`user-auth=${sessionToken1}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.length).toBe(3);
				expect(res.body[0].length).toBe(2);
				expect(res.body[0].some((user: User) => user.id === sallyId)).toBe(true);
				expect(res.body[0].some((user: User) => user.id === bobbyId)).toBe(true);
				expect(res.body[1].length).toBe(0);
				expect(res.body[2]).toBe(false);
			});
	});

	test("sally signs but can't fully sign revision 1", async () => {
		await request(app)
			.post(`/api/release/${release1Id}/toggleSign`)
			.set('Cookie', [`user-auth=${sessionToken1}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.length).toBe(3);
				expect(res.body[0].length).toBe(1);
				expect(res.body[0][0].id).toBe(bobbyId);
				expect(res.body[1].length).toBe(1);
				expect(res.body[1][0].id).toBe(sallyId);
				expect(res.body[2]).toBe(false);
			});
	});

	test("getting signatures for release revision with 1 signature", async () => {
		await request(app)
			.get(`/api/release/${release1Id}/signatures`)
			.set('Cookie', [`user-auth=${sessionToken1}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.length).toBe(3);
				expect(res.body[0].length).toBe(1);
				expect(res.body[0][0].id).toBe(bobbyId);
				expect(res.body[1].length).toBe(1);
				expect(res.body[1][0].id).toBe(sallyId);
				expect(res.body[2]).toBe(false);
			});
	});


	test("bobby can fully sign revision 1", async () => {
		await request(app)
			.post(`/api/release/${release1Id}/toggleSign`)
			.set('Cookie', [`user-auth=${sessionToken2}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.length).toBe(3);
				expect(res.body[0].length).toBe(0);
				expect(res.body[1].length).toBe(2);
				expect(res.body[1].some((user: User) => user.id === sallyId)).toBe(true);
				expect(res.body[1].some((user: User) => user.id === bobbyId)).toBe(true);
				expect(res.body[2]).toBe(true);
			});
	});

	test("getting signatures for release revision with both signatures", async () => {
		await request(app)
			.get(`/api/release/${release1Id}/signatures`)
			.set('Cookie', [`user-auth=${sessionToken1}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.length).toBe(3);
				expect(res.body[0].length).toBe(0);
				expect(res.body[1].length).toBe(2);
				expect(res.body[1].some((user: User) => user.id === sallyId)).toBe(true);
				expect(res.body[1].some((user: User) => user.id === bobbyId)).toBe(true);
				expect(res.body[2]).toBe(true);
			});
	});

	let release2Id: number;
	test('Making a copy of revision 1 makes a revision 2 with no signatures', async () => {
		await request(app)
			.post(`/api/release/${release1Id}/copy`)
			.set('Cookie', [`user-auth=${sessionToken1}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.revision).toBeDefined();
				expect(res.body.revision).toBe(2);
				expect(res.body.signatures).toBeDefined();
				expect(res.body.signatures.length).toBe(0);
				expect(res.body.fullySigned).toBe(false);
				release2Id = res.body.id;
			});
	});

	test("bobby can't sign revision 2", async () => {
		await request(app)
			.post(`/api/release/${release2Id}/toggleSign`)
			.set('Cookie', [`user-auth=${sessionToken2}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.length).toBe(3);
				expect(res.body[0].length).toBe(2);
				expect(res.body[0].some((user: User) => user.id === sallyId)).toBe(true);
				expect(res.body[0].some((user: User) => user.id === bobbyId)).toBe(true);
				expect(res.body[1].length).toBe(0);
				expect(res.body[2]).toBe(false);
			});
	});

	test("sally can sign revision 2 and it will not be fully signed", async () => {
		await request(app)
			.post(`/api/release/${release2Id}/toggleSign`)
			.set('Cookie', [`user-auth=${sessionToken1}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.length).toBe(3);
				expect(res.body[0].length).toBe(1);
				expect(res.body[0][0].id).toBe(bobbyId);
				expect(res.body[1].length).toBe(1);
				expect(res.body[1][0].id).toBe(sallyId);
				expect(res.body[2]).toBe(false);
			});
	});

	test("bobby leaving the project", async () => {
		await request(app)
			.delete(`/api/project/${projectId}`)
			.set('Cookie', [`user-auth=${sessionToken2}`])
			.expect(200);
	});

	test("bobby leaving the project made revision 2 fully signed", async () => {
		await request(app)
			.get(`/api/release/${release2Id}/signatures`)
			.set('Cookie', [`user-auth=${sessionToken1}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.length).toBe(3);
				expect(res.body[0].length).toBe(0);
				expect(res.body[1].length).toBe(1);
				expect(res.body[1][0].id).toBe(sallyId);
				expect(res.body[2]).toBe(true);
			});
	});

	test('reinviting bobby', async () => {
		await request(app)
			.post(`/api/project/${projectId}/invite/bobby@gmail.com`)
			.set('Cookie', [`user-auth=${sessionToken1}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.length).toBe(3);
				expect(res.body[0].length).toBe(1);
				expect(res.body[0][0].id).toBe(bobbyId);
				expect(res.body[1].id).toBe(sallyId);
				expect(res.body[2].length).toBe(0);
			});
	});

	test('Bobby accepting invite again', async () => {
		await request(app)
			.post(`/api/user/acceptInvite/${projectId}`)
			.set('Cookie', [`user-auth=${sessionToken2}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.length).toBe(2);
				expect(res.body[0].length).toBe(0);
				expect(res.body[1].id).toBe(projectId);
			});
	});

	test("revision 2 is no longer fully signed", async () => {
		await request(app)
			.get(`/api/release/${release2Id}/signatures`)
			.set('Cookie', [`user-auth=${sessionToken1}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.length).toBe(3);
				expect(res.body[0].length).toBe(1);
				expect(res.body[0][0].id).toBe(bobbyId);
				expect(res.body[1].length).toBe(1);
				expect(res.body[1][0].id).toBe(sallyId);
				expect(res.body[2]).toBe(false);
			});
	});

	test("revision 1 is still fully signed", async () => {
		await request(app)
			.get(`/api/release/${release1Id}/signatures`)
			.set('Cookie', [`user-auth=${sessionToken1}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.length).toBe(3);
				expect(res.body[0].length).toBe(0);
				expect(res.body[1].length).toBe(2);
				expect(res.body[1].some((user: User) => user.id === sallyId)).toBe(true);
				expect(res.body[1].some((user: User) => user.id === bobbyId)).toBe(true);
				expect(res.body[2]).toBe(true);
			});
	});

});