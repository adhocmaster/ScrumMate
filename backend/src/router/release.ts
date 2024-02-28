import express from "express";
import { newRelease, editRelease, copyRelease } from "../controllers/release";
import { errorWrapper } from '../helpers/errors';

export default (router:express.Router) =>{
  router.post('/project/:projectId/newRelease', errorWrapper(newRelease));
  router.post('/release/:releaseId/edit', errorWrapper(editRelease));
  router.post('/release/:releaseId/copy', errorWrapper(copyRelease));
};
