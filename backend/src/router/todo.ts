import express from "express";
import {createStory, editStory} from '../controllers/todo';

export default(router: express.Router) => {
  router.post('sprint/:sprintId/create', createStory);
  router.post('sprint/:sprintId/story/:storyId/edit', editStory);
}

