import express from "express";
import {createRole, editRole} from '../controllers/role'
import { errorWrapper } from '../helpers/errors';
import { isAuthenticated } from "../middleware/index";

export default (router: express.Router) => {
  router.post('/user/:userId/sprint/:sprintId', isAuthenticated, errorWrapper(createRole));
  router.post('/role/:roleId/edit/:userId', isAuthenticated, errorWrapper(editRole));
}