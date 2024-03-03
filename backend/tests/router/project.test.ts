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

describe("Project API tests", () => {
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

  test('Create Project without auth', async ()=> {
    const body = {name: "new Project"};
    await request(app)
    .post("/api/project")
    .send(body)
    .expect(403)
  });

  test('Update Project', async () => {
    const body = {name: "Updated Project"};
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
	const body = {name: "Updated Project"};
    await request(app)
    .patch(`/api/project/500`)
    .set('Cookie', [`user-auth=${sessionToken}`])
	.send(body)
    .expect(Codes.NotFoundError);
  });

  test("Get Releases of Empty Project", async () => {
    await request(app)
    .get(`/api/project/${projectId}/releases`)
    .set('Cookie', [`user-auth=${sessionToken}`])
    .expect(200)
    .then((res) => {
      expect(res.body).toBeDefined();
      expect(res.body.id).toBeDefined();
      expect(res.body.releases).toEqual([]);
    })
  });
});