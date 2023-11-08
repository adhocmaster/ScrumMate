import express from 'express'
import { update } from 'lodash';
import { deleteUser, getAllUsers ,updateUser} from '../controllers/user'
import { isAuthenticated, isOwner } from '../middleware';

export default (router:express.Router)=>{
    router.get('/users',isAuthenticated, getAllUsers);
    router.delete('/users/:id',isAuthenticated, isOwner, deleteUser);
    router.patch('/users/:id',isAuthenticated, isOwner, updateUser)
}