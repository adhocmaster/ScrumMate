import express from "express";
import { createUser, login, edit } from "../controllers/user";

export default (router:express.Router) =>{
  router.post('/api/user/create', createUser);
  router.post('/api/user/login', login);
  router.post('/api/user/:userId/edit', edit);
};

