import express from 'express'
import { update } from 'lodash';
import { getProjectsFromUser, newProject ,deleteProjectMembers} from '../controllers/project_controller'
import { isAuthenticated, isOwner } from '../middleware';

export default (router:express.Router)=>{
    router.get('/projects',isAuthenticated, getProjectsFromUser);
    router.post('/projects',isAuthenticated, newProject);
    // router.patch('/users/:id',isAuthenticated, isOwner, updateUser)
}