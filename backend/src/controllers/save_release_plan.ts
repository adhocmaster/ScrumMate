import express from "express";
import { Release } from "entity/release";


export const name = async(res: express.Response, req: express.Request) => {
    try{
        const release = new Release();
        
    }catch{
        console.log("No Response");
        return res.sendStatus(400);
    }
}

export const releaseDate = async (res: express.Response, req: express.Request) => {

}

export const userStoriesText = async (res: express.Response, req: express.Request) => {

}

export const highLevelGoals = async (res: express.Response, req: express.Request) => {

}

export const finalizedDate = async (res: express.Response, req: express.Request) => {


}

export const userStories = async (res: express.Response, req: express.Request) => {


}
