import express from "express";
import {createRole, editRole} from '../controllers/role'

export default (router: express.Router) => {
  router.post('/role/create/user/:userId/sprint/:sprintId', createRole);
  router.post('/role/:roleId/edit/:userId', editRole);
}