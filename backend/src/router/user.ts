import express from "express";
import { createUser, login, edit } from "../controllers/user";
import { errorWrapper } from "../helpers/errors";

export default (router:express.Router) =>{
  router.post('/api/user/create', errorWrapper(createUser));
  router.post('/api/user/login', errorWrapper(login));
  router.post('/api/user/:userId/edit', errorWrapper(edit));
};

