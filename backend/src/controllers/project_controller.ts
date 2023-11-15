import express from 'express';
import {
  getProjects,
  createProject,
  getProjectById,
  getMembers,
  addMembers,
  deleteMembers,
  createSprint,
  deleteSprint,
  createRelease,
  deleteRelease,
  changeName,
} from '../db/project';

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
    const values = req.params;
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

