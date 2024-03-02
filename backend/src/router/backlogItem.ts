import express from "express";
import {createStory, editStory} from '../controllers/backlogItem';
import { errorWrapper } from "../helpers/errors";

export default(router: express.Router) => {
  router.post('sprint/:sprintId/create', errorWrapper(createStory));
  router.post('sprint/:sprintId/story/:storyId/edit', errorWrapper(editStory));
}

