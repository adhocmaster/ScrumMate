import express from 'express';
const router = express.Router();
import authentication  from './authentication';
import users from './user'
export default (): express.Router =>{
    authentication(router)
    users(router)
    return router;
}
