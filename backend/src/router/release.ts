import express from "express";
import { newRelease, editRelease, copyRelease } from "../controllers/release";

export default (router:express.Router) =>{
  router.post('/project/:projectId/newRelease', newRelease);
  router.post('/release/:releaseId/edit', editRelease);
  router.post('/release/:releaseId/copy', copyRelease);
};