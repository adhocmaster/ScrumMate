import express from "express";
import { userStories, name, releaseDate, userStoriesText, highLevelGoals, finalizedDate} from "controllers/save_release_plan";
import { release } from "os";


export default (router: express.Router) => {
    router.get('/user', userStories);
    router.get('/user', userStoriesText);
    router.get('/user', name);
    router.get('/user', highLevelGoals);
    router.get('/user', finalizedDate);
    router.get('/user', releaseDate);

}


