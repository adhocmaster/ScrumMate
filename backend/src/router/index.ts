import express from 'express';
import user from './user'
import project from './project';
import release from './release';
import role from './role';
import sprint from './sprint';
import backlogItem from './backlogItem';
const router = express.Router();

export default (): express.Router => {
    user(router);
    project(router);
    release(router);
    role(router);
    sprint(router);
    backlogItem(router);

    return router;
}