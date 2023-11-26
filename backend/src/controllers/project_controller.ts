import express from 'express';
import {
  getProjects,
  createProject,
  getProjectById,
  getMembers,
  addMembers,
  deleteMembers,
  deleteSprint,
  createRelease,
  deleteRelease,
  changeName,
  getProjectsByUser
} from '../db/project';

import { createReleasePlan } from '../db/release';
import {createSprint} from '../db/sprint';
import { createStory } from '../db/story';

export const getProjectsFromUser = async(req:express.Request,res:express.Response) =>{
  try{
    // const projects = await getProjectsByUser()
    console.log("HIT")
    const projects = await getProjectsByUser(req.userId)
    return res.status(200).json(projects)
  }catch(error){
    console.log(error)
    res.sendStatus(400)
  }
} 
export const addSprint = async(req:express.Request,res:express.Response) =>{
  try{
    const addedSprint = await createSprint({...req.body,project_id:req.params.projectId,release_id:req.params.release_id})
    return res.status(200).json(addedSprint)

  }catch(error){
    console.log(error)
    res.sendStatus(400)
  }
}

export const createReleasePlanForProject = async(req:express.Request,res:express.Response) =>{
  try{
    console.log(req.body)
    
    const updatedProject = await createReleasePlan({...req.body,projectId:req.params.projectId})
    return res.status(200).json(updatedProject)
  }catch(error){
    console.log(error)
    res.sendStatus(400)
  }
}
export const getAllProjects = async (req: express.Request, res: express.Response) => {
  try {
    const projects = await getProjects();
    return res.status(200).json(projects);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const newProject = async (req: express.Request, res: express.Response) => {
  try {
    const userId = req.userId;
    const values = {...req.body,owner:userId};
    const newProject = await createProject(values);
    return res.json(newProject);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const getProjectMembers = async (req: express.Request, res: express.Response) => {
  try {
    const projectId = req.params.projectId;
    const members = await getMembers(projectId);
    return res.status(200).json(members);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const addProjectMembers = async (req: express.Request, res: express.Response) => {
  try {
    const projectId = req.params.projectId;
    const memberIds = req.body.memberIds;
    const updatedProject = await addMembers(projectId, memberIds);
    return res.status(200).json(updatedProject);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const deleteProjectMembers = async (req: express.Request, res: express.Response) => {
    try {
      const projectId = req.params.projectId;
      const memberIds = req.body.memberIds;
      const updatedProject = await deleteMembers(projectId, memberIds);
      return res.status(200).json(updatedProject);
    } catch (error) {
      console.log(error);
      return res.sendStatus(400);
    }
  };

  
  export const deleteProjectSprint = async (req: express.Request, res: express.Response) => {
    try {
      const projectId = req.params.projectId;
      const sprintId = req.params.sprintId;
      const updatedProject = await deleteSprint(projectId, sprintId);
      return res.status(200).json(updatedProject);
    } catch (error) {
      console.log(error);
      return res.sendStatus(400);
    }
  };
  
  export const createProjectRelease = async (req: express.Request, res: express.Response) => {
    try {
      const projectId = req.params.projectId;
      const releaseData = req.body.releaseData; 
      const updatedProject = await createRelease(projectId, releaseData);
      return res.status(200).json(updatedProject);
    } catch (error) {
      console.log(error);
      return res.sendStatus(400);
    }
  };
  
  export const deleteProjectRelease = async (req: express.Request, res: express.Response) => {
    try {
      const projectId = req.params.projectId;
      const releaseId = req.params.releaseId;
      const updatedProject = await deleteRelease(projectId, releaseId);
      return res.status(200).json(updatedProject);
    } catch (error) {
      console.log(error);
      return res.sendStatus(400);
    }
  };
  
  export const changeProjectName = async (req: express.Request, res: express.Response) => {
    try {
      const projectId = req.params.projectId;
      const newName = req.body.newName; 
      const updatedProject = await changeName(projectId, newName);
      return res.status(200).json(updatedProject);
    } catch (error) {
      console.log(error);
      return res.sendStatus(400);
    }
  };
  export const addStoryToSprint = async (req: express.Request, res: express.Response) => {
    try {
      const sprintId = req.params.sprintId
      const addedStory = createStory({...req.body,sprint_id:sprintId})
      return res.status(200).json(addedStory);
    } catch(error){
      console.log(error)
      return res.sendStatus(400)
    }

  }
