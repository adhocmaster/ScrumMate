import express from 'express';
import {ProjectModel} from '../db/project';
import { UserModel } from '../db/user';
import { ReleaseModel } from '../db/release';
import {createSprint} from '../db/sprint';
// import { createStory, addStoryToRelease, StoryModel, addStoriesToDatabase } from '../db/story';
import { StoryModel } from '../db/story';
import { IStory } from 'db/interfaces/schemas';



export class ProjectController {
  /**
   * Get projects associated with a user.
   * @param req - Express request object with user ID.
   * @param res - Express response object.
   */
  static async getProjectsFromUser(req: express.Request, res: express.Response) {
      try {
          const projects = await ProjectModel.getProjectsByUser(req.userId);
          return res.status(200).json(projects);
      } catch (error) {
          console.log(error);
          res.sendStatus(400);
      }
  }

  /**
   * Add a new sprint to a project.
   * @param req - Express request object with project and release IDs.
   * @param res - Express response object.
   */
  static async addSprint(req: express.Request, res: express.Response) {
      try {
        //we first need to add all of the stories
        console.log(req.body);
        const createdStories = await StoryModel.addStoriesToDatabase(req.body.user_stories)
        console.log(createdStories)
          const addedSprint = await createSprint({ spikes:req.body.spikes, stories:createdStories, project_id: req.params.projectId,release_id:null });
          return res.status(200).json(addedSprint);
      } catch (error) {
          console.log(error);
          res.sendStatus(400);
      }
  }

  /**
   * Create a release plan for a project.
   * @param req - Express request object with project ID and release plan details.
   * @param res - Express response object.
   */
  static async createReleasePlanForProject(req: express.Request, res: express.Response) {
      try {
          console.log(req.body);
          const createdStories = await StoryModel.addStoriesToDatabase(req.body.user_stories)
          console.log(createdStories)
          const updatedProject = await ReleaseModel.createReleasePlan({ ...req.body,stories:createdStories, projectId: req.params.projectId });
          return res.status(200).json(updatedProject);
      } catch (error) {
          console.log(error);
          res.sendStatus(400);
      }
  }

  /**
   * Get all projects.
   * @param req - Express request object.
   * @param res - Express response object.
   */
  static async getAllProjects(req: express.Request, res: express.Response) {
      try {
          const projects = await ProjectModel.getProjects();
          return res.status(200).json(projects);
      } catch (error) {
          console.log(error);
          return res.sendStatus(400);
      }
  }

  /**
   * Create a new project.
   * @param req - Express request object with project details.
   * @param res - Express response object.
   */
  static async newProject(req: express.Request, res: express.Response) {
      try {
          const userId = req.userId;
          var values = { ...req.body, owner: userId };
          if(req.body?.members.length>0){
            const userEmails = await UserModel.findUserIdsByEmails(req.body.members)
            values.members = userEmails
          }
          const createdProject = await ProjectModel.createProject(values);
          return res.json(createdProject);
      } catch (error) {
          console.log(error);
          return res.sendStatus(400);
      }
  }
  /**
     * Get project members.
     * @param req - Express request object with project ID.
     * @param res - Express response object.
     */
  static async getProjectMembers(req: express.Request, res: express.Response) {
    try {
        const projectId = req.params.projectId;
        const members = await ProjectModel.getMembers(projectId);
        return res.status(200).json(members);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
  }

  /**
   * Add project members.
   * @param req - Express request object with project ID and member IDs.
   * @param res - Express response object.
   */
  static async addProjectMembers(req: express.Request, res: express.Response) {
      try {
          const projectId = req.params.projectId;
          const memberIds = req.body.memberIds;
          const updatedProject = await ProjectModel.addMembers(projectId, memberIds);
          return res.status(200).json(updatedProject);
      } catch (error) {
          console.log(error);
          return res.sendStatus(400);
      }
  }

  /**
   * Delete project members.
   * @param req - Express request object with project ID and member IDs.
   * @param res - Express response object.
   */
  static async deleteProjectMembers(req: express.Request, res: express.Response) {
    try {
        const projectId = req.params.projectId;
        const memberIds = req.body.memberIds;
        const updatedProject = await ProjectModel.deleteMembers(projectId, memberIds);
        return res.status(200).json(updatedProject);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
  }

  /**
   * Delete a sprint from a project.
   * @param req - Express request object with project ID and sprint ID.
   * @param res - Express response object.
   */
  static async deleteProjectSprint(req: express.Request, res: express.Response) {
    try {
        const projectId = req.params.projectId;
        const sprintId = req.params.sprintId;
        const updatedProject = await ProjectModel.deleteSprint(projectId, sprintId);
        return res.status(200).json(updatedProject);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
  }

  /**
   * Delete a release from a project.
   * @param req - Express request object with project ID and release ID.
   * @param res - Express response object.
   */
  static async deleteProjectRelease(req: express.Request, res: express.Response) {
    try {
        const projectId = req.params.projectId;
        const releaseId = req.params.releaseId;
        const updatedProject = await ProjectModel.deleteRelease(projectId, releaseId);
        return res.status(200).json(updatedProject);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
  }

  /**
   * Change the name of a project.
   * @param req - Express request object with project ID and new project name.
   * @param res - Express response object.
   */
  static async changeProjectName(req: express.Request, res: express.Response) {
    try {
        const projectId = req.params.projectId;
        const newName = req.body.newName;
        const updatedProject = await ProjectModel.changeName(projectId, newName);
        return res.status(200).json(updatedProject);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
  }

  /**
   * Add a story to a sprint.
   * @param req - Express request object with sprint ID and story details.
   * @param res - Express response object.
   */
    static async addStoryToSprint(req: express.Request, res: express.Response) {
        try {
            const sprintId = req.params.sprintId;
            const addedStory = await StoryModel.createStory({ ...req.body, sprint_id: sprintId });
            return res.status(200).json(addedStory);
        } catch (error) {
            console.log(error);
            return res.sendStatus(400);
        }
    }
    static async addStoryToRelease(req: express.Request, res: express.Response) {
        try {
            const releaseId = req.params.releaseId;
            const addedStory = await StoryModel.addStoryToRelease({ ...req.body, release_id: releaseId });
            return res.status(200).json(addedStory);
        } catch (error) {
            console.log(error);
            return res.sendStatus(400);
        }
    }
    static async getProjectById(req: express.Request, res: express.Response) {
        try{
            const projectId = req.params.projectId
            console.log("projectId",projectId)
            const project = await ProjectModel.getProjectById(projectId)
            console.log(project)
            return res.status(200).json(project);
        } catch (error) {
            console.log(error);
            return res.sendStatus(400);
        }
    }
    static async saveReleasePlan(req: express.Request, res: express.Response) {
        try{
            //add the release plan portion here.
            //attributes needed
            //name, date, goals, user stories, etc.
        } catch (error) {
            console.log(error)
            return res.sendStatus(400)
        }
    }

}
