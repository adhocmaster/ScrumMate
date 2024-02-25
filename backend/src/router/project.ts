import express from "express";
import { newProject, joinProject, editProject, getReleases} from "../controllers/project";


export default (router:express.Router) => {
  router.post('/api/project/:userId/newProject', newProject);
  router.post('/api/project/:userId/joinProject/:projectId', joinProject);
  router.post('/api/project/:projectId/edit', editProject)
  router.post('/api/project/:projectId/releases', getReleases);
};
