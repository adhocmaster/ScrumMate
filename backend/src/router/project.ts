import express from "express";
import { newProject, joinProject, editProject, getReleases, getName } from "../controllers/project";
import { errorWrapper } from '../helpers/errors';


export default (router:express.Router) => {
  router.post('/api/project/:userId/newProject', errorWrapper(newProject));
  router.post('/api/project/:userId/joinProject/:projectId', errorWrapper(joinProject));
  router.post('/api/project/:projectId/edit', errorWrapper(editProject))
  router.post('/api/project/:projectId/releases', errorWrapper(getReleases));
  router.get('/project/:projectId', errorWrapper(getName));
};
