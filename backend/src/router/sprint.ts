import express from "express";
import { createSprint, editSprint} from '../controllers/sprint';
import { errorWrapper } from '../helpers/errors';

export default (router: express.Router) => {
  router.post('/release/:releaseId/sprint/create', errorWrapper(createSprint));
  router.post('/sprint/:sprintId/edit', errorWrapper(editSprint));
}
