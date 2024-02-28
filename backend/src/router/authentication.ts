import express from 'express'
import {register, login} from '../controllers/authentication'
import { errorWrapper } from '../helpers/errors';


export default (router:express.Router) =>{
    router.post('/auth/register', errorWrapper(register));
    router.post('/auth/login',errorWrapper(login) );
};