import express from 'express';
const router = express.Router();
import authentication  from './authentication';
import users from './user'
import projects from './projects'
export default (): express.Router =>{
    authentication(router)
    users(router)
    projects(router)
    return router;
}
