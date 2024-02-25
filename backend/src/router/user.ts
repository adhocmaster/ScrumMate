import express from "express";
import {createUser, login, edit} from '../controllers/user';

export default (router:express.Router) =>{
  router.post('/user/create', createUser);
  router.post('/user/login', login);
  router.post('/user/:userId/edit', edit);
};

