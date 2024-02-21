import express from 'express';
import { AppDataSource } from '../src/data-source';
import { Release } from "../src/entity/release"
import request from 'supertest'
import { newReleaseRouter } from '../src/router/release';
import {getReleasesRouter } from '../src/router/project';
import { createUserRouter } from '../src/router/user';
let app = express();

const init = AppDataSource.initialize().then(async () => {
  app.use(express.json())
  app.use(newReleaseRouter);
  app.use(getReleasesRouter);
  app.use(createUserRouter);
  const server = app.listen(8080)
  return {app, server};
  
});


let server;

beforeAll(async () => {
  const appData = await init;
  app = appData.app;
  server = appData.server;
})

// afterEach(() => {
//   AppDataSource.destroy();
// })

test("CREATE USER", async() => {
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

test("Invalid password login", async()=> {
  const body = {email: "sallys@gmail.com", password: "wrongPassword"}
  await request(app)
  .post("/api/user/login")
  .send(body)
  .expect(403);
});

test("Valid login", async()=> {
  const body = {email: "sallys@gmail.com", password: "password123"}
  await request(app)
  .post("/api/user/login")
  .send(body)
  .expect(200);
});