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
import { BacklogItem, ActionType } from '../../src/entity/backlogItem';
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

describe("Release API tests", () => {
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

	let projectId: Number;
	let sprintId: Number;
	let releaseId: Number;

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
				expect(res.body.id).toBeDefined();
				releaseId = res.body.id;
				expect(res.body.goalStatement).toBeDefined();
			});
	});

	test('New Sprint', async () => {
		const body = { "sprintNumber": 1, "startDate": "1709330028", "endDate": "1709330028", "goal": "New sprint goal" }
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

	let backlogIdOriginal: Number;
	let backlogId: Number;

	test('New Story', async () => {
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
			.set('Cookie', [`user-auth=${sessionToken}`])
			.send(body)
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.id).toBeDefined();
				backlogId = res.body.id;
				backlogIdOriginal = backlogId;
				expect(res.body.rank).toEqual(0);
			});
	});

	test('Edit Story', async () => {
		const body = {
			"priority": 3
		}
		await request(app)
			.post(`/api/story/${backlogId}/edit`)
			.set('Cookie', [`user-auth=${sessionToken}`])
			.send(body)
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.id).toBeDefined();
				backlogId = res.body.id;
				expect(res.body.priority).toEqual(3);
				expect(res.body.rank).toEqual(0);
			});
	});

	test('Second Story in sprint', async () => {
		const body = {
			"userTypes": "plants",
			"functionalityDescription": "allows plants to feel pain",
			"reasoning": "why not",
			"acceptanceCriteria": "be able to hear their cries of agony",
			"storyPoints": 100,
			"priority": 1
		}
		await request(app)
			.post(`/api/sprint/${sprintId}`)
			.set('Cookie', [`user-auth=${sessionToken}`])
			.send(body)
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.id).toBeDefined();
				backlogId = res.body.id;
				expect(res.body.rank).toEqual(1);
			});
	});

	test('Drag Second Story to release backlog', async () => {
		const body = {
			"sourceType": "sprint",
			"sourceRank": 1,
			"destinationType": "backlog",
			"destinationRank": 0,
		}
		await request(app)
			.post(`/api/backlogItem/${sprintId}/${releaseId}/reorder`)
			.set('Cookie', [`user-auth=${sessionToken}`])
			.send(body)
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.length).toBe(2);
				expect(res.body[0].length).toBe(1);
				expect(res.body[0][0].rank).toBe(0);
				expect(res.body[1].length).toBe(1);
				expect(res.body[1][0].rank).toBe(0);
			});
	});

	test("The story moved from the sprint is no longer in the sprint", async () => {
		await request(app)
			.get(`/api/release/${releaseId}/sprints`)
			.set('Cookie', [`user-auth=${sessionToken}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.length).toBe(1)
				expect(res.body[0].todos.length).toBe(1)
				expect(res.body[0].todos[0].rank).toBe(0)
				expect(res.body[0].todos[0].id).toBe(backlogIdOriginal)
			});
	});

	test("The story moved from the sprint is in the backlog", async () => {
		await request(app)
			.get(`/api/release/${releaseId}/backlog`)
			.set('Cookie', [`user-auth=${sessionToken}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.backlog.length).toBe(1)
				expect(res.body.backlog[0].id).toBe(backlogId)
				expect(res.body.backlog[0].rank).toBe(0)
				expect(res.body.backlogItemCount).toBe(1)
			});
	});

	var newStoryId: number;
	test('new Story in sprint', async () => {
		const body = {
			"userTypes": "plants",
			"functionalityDescription": "make plants shoot at zombies",
			"reasoning": "defend house",
			"acceptanceCriteria": "plant shoots zombie",
			"storyPoints": 21,
			"priority": 1
		}
		await request(app)
			.post(`/api/sprint/${sprintId}`)
			.set('Cookie', [`user-auth=${sessionToken}`])
			.send(body)
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.id).toBeDefined();
				newStoryId = res.body.id;
				expect(res.body.rank).toEqual(1);
			});
	});

	test("Original story in the sprint can be deleted", async () => {
		await request(app)
			.post(`/api/backlogItem/${backlogIdOriginal}/delete`)
			.set('Cookie', [`user-auth=${sessionToken}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.length).toBe(1)
				expect(res.body[0].id).toBe(newStoryId)
				expect(res.body[0].rank).toBe(0)
			});
	});

	test("Original story removed is no longer in the sprint", async () => {
		await request(app)
			.get(`/api/release/${releaseId}/sprints`)
			.set('Cookie', [`user-auth=${sessionToken}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.length).toBe(1)
				expect(res.body[0].todos.length).toBe(1)
				expect(res.body[0].todos[0].id).toBe(newStoryId)
				expect(res.body[0].todos[0].rank).toBe(0)
			});
	});

	var action1Id: number, action2Id: number;
	test('first new Action Item goes in sprint', async () => {
		const body = {
			"actionType": ActionType.BUG,
			"description": "zombies spawn in wrong lane",
			"storyPoints": 21,
		}
		await request(app)
			.post(`/api/sprint/${sprintId}/action`)
			.set('Cookie', [`user-auth=${sessionToken}`])
			.send(body)
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.id).toBeDefined();
				action1Id = res.body.id;
				expect(res.body.rank).toEqual(1);
				expect(res.body.actionType).toEqual(ActionType.BUG);
				expect(res.body.description).toEqual("zombies spawn in wrong lane");
			});
	});

	test('second new Action Item goes in backlog', async () => {
		const body = {
			"actionType": ActionType.SPIKE,
			"description": "learn how to code in Swift",
			"storyPoints": 13,
		}
		await request(app)
			.post(`/api/release/${releaseId}/action`)
			.set('Cookie', [`user-auth=${sessionToken}`])
			.send(body)
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.id).toBeDefined();
				action2Id = res.body.id;
				expect(res.body.rank).toEqual(1);
				expect(res.body.actionType).toEqual(ActionType.SPIKE);
				expect(res.body.description).toEqual("learn how to code in Swift");
			});
	});

	test("First action item is in the sprint", async () => {
		await request(app)
			.get(`/api/release/${releaseId}/sprints`)
			.set('Cookie', [`user-auth=${sessionToken}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.length).toBe(1)
				expect(res.body[0].todos.length).toBe(2)
				expect(res.body[0].todos[0].id).toBe(newStoryId)
				expect(res.body[0].todos[0].rank).toBe(0)
				expect(res.body[0].todos[1].id).toBe(action1Id)
				expect(res.body[0].todos[1].rank).toBe(1)
				expect(res.body[0].backlogItemCount).toBe(2)
			});
	});

	test("Second action item is in the backlog", async () => {
		await request(app)
			.get(`/api/release/${releaseId}/backlog`)
			.set('Cookie', [`user-auth=${sessionToken}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.backlog.length).toBe(2)
				expect(res.body.backlog[0].id).toBe(backlogId)
				expect(res.body.backlog[0].rank).toBe(0)
				expect(res.body.backlog[1].id).toBe(action2Id)
				expect(res.body.backlog[1].rank).toBe(1)
				expect(res.body.backlogItemCount).toBe(2)
			});
	});

	test('Edit second Action item', async () => {
		const body = {
			"actionType": ActionType.INFRASTRUCTURE,
			"description": "Set up VS Code"
		}
		await request(app)
			.post(`/api/action/${action2Id}/edit`)
			.set('Cookie', [`user-auth=${sessionToken}`])
			.send(body)
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.id).toBeDefined();
				expect(res.body.id).toEqual(action2Id);
				expect(res.body.rank).toEqual(1);
				expect(res.body.actionType).toEqual(ActionType.INFRASTRUCTURE);
				expect(res.body.description).toEqual("Set up VS Code");
				expect(res.body.rank).toEqual(1);
			});
	});

	test('Drag Second action to sprint', async () => {
		const body = {
			"sourceType": "backlog",
			"sourceRank": 1,
			"destinationType": "sprint",
			"destinationRank": 1,
		}
		await request(app)
			.post(`/api/backlogItem/${releaseId}/${sprintId}/reorder`)
			.set('Cookie', [`user-auth=${sessionToken}`])
			.send(body)
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.length).toBe(2);
				expect(res.body[0].length).toBe(1);
				expect(res.body[0][0].rank).toBe(0);
				expect(res.body[0][0].id).toBe(backlogId);
				expect(res.body[1].length).toBe(3);
				expect(res.body[1][0].rank).toBe(0);
				expect(res.body[1][0].id).toBe(newStoryId);
				expect(res.body[1][1].rank).toBe(1);
				expect(res.body[1][1].id).toBe(action2Id);
				expect(res.body[1][2].rank).toBe(2);
				expect(res.body[1][2].id).toBe(action1Id);
			});
	});

	test("second action item can be deleted", async () => {
		await request(app)
			.post(`/api/backlogItem/${action2Id}/delete`)
			.set('Cookie', [`user-auth=${sessionToken}`])
			.expect(200)
			.then((res) => {
				expect(res.body).toBeDefined();
				expect(res.body.length).toBe(2)
				expect(res.body[0].id).toBe(newStoryId)
				expect(res.body[0].rank).toBe(0)
				expect(res.body[1].id).toBe(action1Id)
				expect(res.body[1].rank).toBe(1)
			});
	});
});