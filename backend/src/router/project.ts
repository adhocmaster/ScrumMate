import express from "express";
import { newProject, joinProject, editProject, getReleases} from "../controllers/project";


export default (router:express.Router) => {
  router.post('/project/:userId/newProject', newProject);
  router.post('/project/:userId/joinProject/:projectId', joinProject);
  router.post('/project/:projectId/edit', editProject)
  router.post('/project/:projectId/releases', getReleases);
};
