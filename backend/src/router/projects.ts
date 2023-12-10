import express from 'express'
import { update } from 'lodash';
import { ProjectController} from '../controllers/project_controller'
import { isAuthenticated, isOwner } from '../middleware';

export default (router:express.Router)=>{
    router.get('/projects',isAuthenticated, ProjectController.getProjectsFromUser);
    router.get('/projects/:projectId', ProjectController.getProjectById);
    router.post('/projects',isAuthenticated, ProjectController.newProject);
    router.post('/projects/release/:projectId',ProjectController.createReleasePlanForProject)
    router.post('/projects/:projectId/sprint/',ProjectController.addSprint)
    router.put('/projects/:projectId/members',ProjectController.addProjectMembers)
    router.put('/projects/story/:sprintId/',ProjectController.addStoryToSprint)
    router.put('/projects/story/release/:releaseId/',ProjectController.addStoryToRelease)
    

}