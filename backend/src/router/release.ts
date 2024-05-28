/* eslint-disable import/no-anonymous-default-export */
import express from "express";
import { newRelease, editRelease, copyRelease, getRelease, getReleaseAndBacklog, toggleSigning, getSignatures, getSigningCondition } from "../controllers/release";
import { errorWrapper } from '../helpers/errors';
import { isAuthenticated } from "../../src/middleware/index";

export default (router: express.Router) => {
	router.post('/project/:projectId/release', isAuthenticated, errorWrapper(newRelease));
	router.post('/release/:releaseId/edit', isAuthenticated, errorWrapper(editRelease));
	router.post('/release/:releaseId/copy', isAuthenticated, errorWrapper(copyRelease));
	router.get('/release/:releaseId', errorWrapper(getRelease));
	router.get('/release/:releaseId/backlog', errorWrapper(getReleaseAndBacklog));
	router.post('/release/:releaseId/toggleSign', isAuthenticated, errorWrapper(toggleSigning));
	router.get('/release/:releaseId/signatures', isAuthenticated, errorWrapper(getSignatures));
	router.get('/release/:releaseId/signingCondtion', isAuthenticated, errorWrapper(getSigningCondition));
};
