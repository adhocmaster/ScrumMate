import express from "express";
import { createUser, login, edit, getProjects } from "../controllers/user";
import { errorWrapper } from "../helpers/errors";
import { isAuthenticated } from "../middleware/index";
export default (router:express.Router) =>{
  router.post('/user/create', errorWrapper(createUser));
  router.post('/user/login', errorWrapper(login));
  router.post('/user/edit', isAuthenticated, errorWrapper(edit));
  router.get('/user/projects', isAuthenticated, errorWrapper(getProjects));
};

