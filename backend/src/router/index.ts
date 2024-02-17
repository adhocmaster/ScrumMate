import express from 'express';
const router = express.Router();
import authentication  from './authentication';
import users from './user';
import projects from './projects';
import release from './release';

export default (): express.Router =>{
    authentication(router)
    users(router)
    projects(router)
    release(router)
    return router;
}
