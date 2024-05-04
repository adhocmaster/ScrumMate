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

	let projectId: Number;
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
});