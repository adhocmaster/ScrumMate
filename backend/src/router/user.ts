import express from 'express';
import { UserController } from '../controllers/user';
import { isAuthenticated, isOwner } from '../middleware';

export default (router: express.Router) => {
    router.get('/users', isAuthenticated, UserController.getAllUsers);
    router.delete('/users/:id', isAuthenticated, isOwner, UserController.deleteUser);
    router.patch('/users/:id', isAuthenticated, isOwner, UserController.updateUser);
}
