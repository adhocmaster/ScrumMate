import express from 'express';
import { AppDataSource } from '../src/data-source';
import { Release } from "../src/entity/release"
import request from 'supertest'
import { newReleaseRouter } from '../src/router/release';
import {getReleasesRouter } from '../src/router/project';
import { createUserRouter } from '../src/router/user';
import { User } from '../src/entity/User';
import { Project } from '../src/entity/project';
import { UserRole } from '../src/entity/roles';
import { Sprint } from '../src/entity/sprint';
import { TodoItem } from '../src/entity/todo';
import { DataSource } from 'typeorm';

let app = express();
var appData: { app: any; server: any; destroy?: any; };
let server;

beforeAll(async () => {
	appData = await AppDataSource.initialize().then(async () => {
		app.use(express.json())
		app.use(newReleaseRouter);
		app.use(getReleasesRouter);
		app.use(createUserRouter);
		const server = app.listen(8080)
		return {app, server};
	  });;
	app = appData.app;
	server = appData.server;
})

afterAll(async () => {
	const userRepository = await AppDataSource.getRepository(User)
	const projectRepository = await AppDataSource.getRepository(Project)
	const releaseRepository = await AppDataSource.getRepository(Release)
	const sprintRepository = await AppDataSource.getRepository(Sprint)
	const todoRepository = await AppDataSource.getRepository(TodoItem)
	const rolesRepository = await AppDataSource.getRepository(UserRole)

	await rolesRepository.delete({});
	await todoRepository.delete({});
	await sprintRepository.delete({});
	await releaseRepository.delete({});
	await projectRepository.delete({});
	await userRepository.delete({});
	await AppDataSource.destroy();
});

describe("User API tests", () => {

	test("CREATE USER", async () => {
		const body = {username: "sally", email: "sallys@gmail.com", password: "password123"}
		await request(app)
		.post("/api/user/create")
		.send(body)
		.expect(200)
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

	test("Valid login", async () => {
		const body = {email: "sallys@gmail.com", password: "password123"}
		await request(app)
		.post("/api/user/login")
		.send(body)
		.expect(200);
	});

});