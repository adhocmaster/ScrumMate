/* eslint-disable import/no-anonymous-default-export */
import express from "express";
import { createStory, editStory, moveBacklog } from '../controllers/backlogItem';
import { errorWrapper } from "../helpers/errors";
import { isAuthenticated } from "../middleware/index";

export default (router: express.Router) => {
	router.post('/sprint/:sprintId/', isAuthenticated, errorWrapper(createStory));
	router.post('/sprint/:sprintId/story/:storyId/edit', isAuthenticated, errorWrapper(editStory));
	// router.post('/backlogItem/:sourceId/:destinationId/reorder', errorWrapper(moveBacklog));
}
