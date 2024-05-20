/* eslint-disable import/no-anonymous-default-export */
import express from "express";
import { createStory, createNewBacklogStory, createAction, createNewBacklogAction, editStory, editAction, moveBacklog, deleteBacklogItem, getBacklogItemPoker, placePokerEstimate } from '../controllers/backlogItem';
import { errorWrapper } from "../helpers/errors";
import { isAuthenticated } from "../middleware/index";

export default (router: express.Router) => {
	router.post('/sprint/:sprintId/', isAuthenticated, errorWrapper(createStory));
	router.post('/release/:releaseId/', isAuthenticated, errorWrapper(createNewBacklogStory));
	router.post('/sprint/:sprintId/action', isAuthenticated, errorWrapper(createAction));
	router.post('/release/:releaseId/action', isAuthenticated, errorWrapper(createNewBacklogAction));
	router.post('/story/:storyId/edit', isAuthenticated, errorWrapper(editStory));
	router.post('/action/:actionId/edit', isAuthenticated, errorWrapper(editAction));
	router.post('/backlogItem/:backlogItemId/delete', isAuthenticated, errorWrapper(deleteBacklogItem));
	router.post('/backlogItem/:sourceId/:destinationId/reorder', isAuthenticated, errorWrapper(moveBacklog));
	router.get('/backlogItem/:backlogItemId/poker', isAuthenticated, errorWrapper(getBacklogItemPoker));
	router.post('/backlogItem/:backlogItemId/poker', isAuthenticated, errorWrapper(placePokerEstimate));
}
