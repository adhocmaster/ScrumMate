import express from "express";
import { createSprint, deleteSprint, editSprint, getSprintWithRelease, getSprints, moveSprint} from '../controllers/sprint';
import { errorWrapper } from '../helpers/errors';
import { isAuthenticated } from "../middleware/index";

export default (router: express.Router) => {
  router.post('/release/:releaseId/sprint', isAuthenticated, errorWrapper(createSprint));
  router.post('/sprint/:sprintId/edit', isAuthenticated, errorWrapper(editSprint));
  router.get('/release/:releaseId/sprints', errorWrapper(getSprints));
  router.get('/sprint/:sprintId', errorWrapper(getSprintWithRelease));
  router.post('/release/:releaseId/reorder', errorWrapper(moveSprint));
  router.delete('/sprint/:sprintId', isAuthenticated, errorWrapper(deleteSprint));
}
