// project.ts

import mongoose, { Document, Schema } from 'mongoose';
import { IProject } from './interfaces/schemas';

const projectSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: true },
  releases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Release' }],
  sprints: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sprint' }],
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

export const ProjectModel = mongoose.model<IProject>('Project', projectSchema);

export const getProjects = () => ProjectModel.find();

export const createProject = (values: Record<string, any>) => new ProjectModel(values).save().then((project) => project.toObject());

export const getProjectById = (projectId: string) => ProjectModel.findById(projectId);

export const getMembers = (projectId: string) => ProjectModel.findById(projectId).select('members').populate('members');

export const addMembers = (projectId: string, memberIds: string[]) =>
  ProjectModel.findByIdAndUpdate(projectId, { $addToSet: { members: { $each: memberIds } } }, { new: true });

export const deleteMembers = (projectId: string, memberIds: string[]) =>
  ProjectModel.findByIdAndUpdate(projectId, { $pullAll: { members: memberIds } }, { new: true });

export const deleteSprint = (projectId: string, sprintId: string) =>
  ProjectModel.findByIdAndUpdate(projectId, { $pull: { sprints: sprintId } }, { new: true });

export const deleteRelease = (projectId: string, releaseId: string) =>
  ProjectModel.findByIdAndUpdate(projectId, { $pull: { releases: releaseId } }, { new: true });

export const changeName = (projectId: string, newName: string) =>
  ProjectModel.findByIdAndUpdate(projectId, { $set: { name: newName } }, { new: true });

export const getProjectsByUser = (userId: string) => {
  return ProjectModel.find({
    $or: [
      { owner: new mongoose.Types.ObjectId(userId) },
      { members: new mongoose.Types.ObjectId(userId) },
    ],
  }).populate('releases').populate('sprints').exec();
};
