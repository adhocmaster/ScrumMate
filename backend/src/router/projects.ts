import express from 'express'
import { update } from 'lodash';
import { getProjectsFromUser, newProject ,deleteProjectMembers, createReleasePlanForProject, addSprint,addProjectMembers,addStoryToSprint} from '../controllers/project_controller'
import { isAuthenticated, isOwner } from '../middleware';

export default (router:express.Router)=>{
    router.get('/projects',isAuthenticated, getProjectsFromUser);
    router.post('/projects',isAuthenticated, newProject);
    router.post('/projects/release/:projectId',createReleasePlanForProject)
    router.post('/projects/release/:projectId/sprint/:releaseId',addSprint)
    router.put('/projects/:projectId/members',addProjectMembers)
    router.put('/projects/story/:sprintId/',addStoryToSprint)
    // router.patch('/users/:id',isAuthenticated, isOwner, updateUser)
}