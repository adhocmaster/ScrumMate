import  express from "express";
import { getProjects, createProject} from "../db/project";

export const getAllProjects = async (req:express.Request, res: express.Response) =>{
    try{
        const users = await getProjects();
        return res.status(200).json(users)
    }catch(error){
        console.log(error)
        return res.sendStatus(400)
    }
}

export const newProject = async (req:express.Request, res: express.Response) =>{
    try{
       const values = req.params; 
       const newProject = await createProject(values);
        return res.json(newProject)
    }catch(error){
        console.log(error)
        return res.sendStatus(400)
    }
}
