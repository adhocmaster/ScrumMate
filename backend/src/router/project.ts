/* eslint-disable import/no-anonymous-default-export */
import express from "express";
import { newProject, joinProject, editProject, getReleases, getRecentRelease, getName, getMembers, sendInvite, leaveProject } from "../controllers/project";
import { errorWrapper } from '../helpers/errors';
import { isAuthenticated } from "../middleware/index";

export default (router: express.Router) => {
	router.post('/project', isAuthenticated, errorWrapper(newProject));
	router.post('/project/:userId/joinProject/:projectId', errorWrapper(joinProject));
	router.patch('/project/:projectId', isAuthenticated, errorWrapper(editProject));
	router.get('/project/:projectId/releases', isAuthenticated, errorWrapper(getReleases));
	router.get('/project/:projectId/recentRelease', isAuthenticated, errorWrapper(getRecentRelease));
	router.get('/project/:projectId/getName', isAuthenticated, errorWrapper(getName));
	router.get('/project/:projectId/getMembers', isAuthenticated, errorWrapper(getMembers));
	router.post('/project/:projectId/invite/:userEmail', isAuthenticated, errorWrapper(sendInvite));
	router.delete('/project/:projectId', isAuthenticated, errorWrapper(leaveProject));
};
