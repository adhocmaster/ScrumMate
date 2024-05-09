/* eslint-disable import/no-anonymous-default-export */
import express from "express";
import { newProject, forceJoinProject, editProject, getReleases, getRecentRelease, getName, getMembers, removeMember, sendInvite, cancelInvite, leaveProject } from "../controllers/project";
import { errorWrapper } from '../helpers/errors';
import { isAuthenticated } from "../middleware/index";

export default (router: express.Router) => {
	router.post('/project', isAuthenticated, errorWrapper(newProject));
	router.post('/project/:userId/forceJoinProject/:projectId', errorWrapper(forceJoinProject));
	router.patch('/project/:projectId', isAuthenticated, errorWrapper(editProject));
	router.get('/project/:projectId/releases', isAuthenticated, errorWrapper(getReleases));
	router.get('/project/:projectId/recentRelease', isAuthenticated, errorWrapper(getRecentRelease));
	router.get('/project/:projectId/getName', isAuthenticated, errorWrapper(getName));
	router.get('/project/:projectId/getMembers', isAuthenticated, errorWrapper(getMembers));
	router.post('/project/:projectId/removeMember/:memberId', isAuthenticated, errorWrapper(removeMember));
	router.post('/project/:projectId/invite/:userEmail', isAuthenticated, errorWrapper(sendInvite));
	router.post('/project/:projectId/cancelInvite/:userId', isAuthenticated, errorWrapper(cancelInvite));
	router.delete('/project/:projectId', isAuthenticated, errorWrapper(leaveProject));
};
