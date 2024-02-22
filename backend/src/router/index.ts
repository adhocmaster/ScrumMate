import express from 'express';
const router = express.Router();
import authentication  from './authentication';
import users from './user'
import project from './project'

export default (): express.Router =>{
    authentication(router)
    users(router)
    project(router)
    return router;
}