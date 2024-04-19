/* eslint-disable import/no-anonymous-default-export */
import express from "express";
import { newProject, joinProject, editProject, getReleases, getRecentRelease, getName, getRowData } from "../controllers/project";
import { errorWrapper } from '../helpers/errors';
import { isAuthenticated } from "../middleware/index";

export default (router: express.Router) => {
	router.post('/project', isAuthenticated, errorWrapper(newProject));
	router.post('/project/:userId/joinProject/:projectId', errorWrapper(joinProject));
	router.patch('/project/:projectId', isAuthenticated, errorWrapper(editProject))
	router.get('/project/:projectId/releases', isAuthenticated, errorWrapper(getReleases));
	router.get('/project/:projectId/recentRelease', isAuthenticated, errorWrapper(getRecentRelease));
	router.get('/project/:projectId/getName', isAuthenticated, errorWrapper(getName));
	router.get('/project/:projectId/getRowData', isAuthenticated, errorWrapper(getRowData));
};
