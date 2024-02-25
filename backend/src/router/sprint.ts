import express from "express";
import { AppDataSource } from "../data-source";
import { Sprint } from "../entity/sprint";
import { Release } from "../entity/release";
import { createSprint, editSprint} from '../controllers/sprint';

export default (router: express.Router) => {
  router.post('/release/:releaseId/sprint/create', createSprint);
  router.post('/sprint/:sprintId/edit', editSprint);
}