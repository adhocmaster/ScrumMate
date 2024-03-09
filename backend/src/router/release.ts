import express from "express";
import { newRelease, editRelease, copyRelease, getRelease, getReleaseAndBacklog } from "../controllers/release";
import { errorWrapper } from '../helpers/errors';
import { isAuthenticated } from "../../src/middleware/index";

export default (router:express.Router) =>{
  router.post('/project/:projectId/release', isAuthenticated, errorWrapper(newRelease));
  router.post('/release/:releaseId/edit', isAuthenticated, errorWrapper(editRelease));
  router.post('/release/:releaseId/copy', isAuthenticated,  errorWrapper(copyRelease));
  router.get('/release/:releaseId', errorWrapper(getRelease));
  router.get('/release/:releaseId/backlog', errorWrapper(getReleaseAndBacklog));
};
