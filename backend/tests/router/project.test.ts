import express from 'express';
import { AppDataSource, Database } from '../../src/data-source';
import { Release } from "../../src/entity/release"
import request from 'supertest'
import router from '../../src/router/index';
// import { newReleaseRouter } from '../src/router/release';
import user from '../../src/router/user';
import project from '../../src/router/project';
import { User } from '../../src/entity/User';
import { Project } from '../../src/entity/project';
import { UserRole } from '../../src/entity/roles';
import { Sprint } from '../../src/entity/sprint';
import { BacklogItem } from '../../src/entity/backlogItem';
import cookieParser from 'cookie-parser';

let app = express();
var appData: { app: any; server: any; destroy?: any; };
let server;

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
    });
  });
});