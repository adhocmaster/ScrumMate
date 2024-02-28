import express from "express";
import {createRole, editRole} from '../controllers/role'
import { errorWrapper } from '../helpers/errors';

export default (router: express.Router) => {
  router.post('/role/create/user/:userId/sprint/:sprintId', errorWrapper(createRole));
  router.post('/role/:roleId/edit/:userId', errorWrapper(editRole));
}