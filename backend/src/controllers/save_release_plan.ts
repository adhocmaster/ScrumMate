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

