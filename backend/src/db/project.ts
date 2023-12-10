

import mongoose, { Document, Schema, Model } from 'mongoose';
import { IProject } from './interfaces/schemas';

interface IProjectModel extends Model<IProject> {
  getProjects: () => Promise<IProject[]>;
  createProject: (values: Record<string, any>) => Promise<IProject>;
  getProjectById: (projectId: string) => Promise<IProject | null>;
  getMembers: (projectId: string) => Promise<IProject | null>;
  addMembers: (projectId: string, memberIds: string[]) => Promise<IProject | null>;
  deleteMembers: (projectId: string, memberIds: string[]) => Promise<IProject | null>;
  deleteSprint: (projectId: string, sprintId: string) => Promise<IProject | null>;
  deleteRelease: (projectId: string, releaseId: string) => Promise<IProject | null>;
  changeName: (projectId: string, newName: string) => Promise<IProject | null>;
  getProjectsByUser: (userId: string) => Promise<IProject[]>;
}

const projectSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: true },
  releases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Release' }],
  sprints: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sprint' }],
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

projectSchema.statics.getProjects = function () {
  return this.find();
};

projectSchema.statics.createProject = function (values: Record<string, any>) {
  return this.create(values);
};

projectSchema.statics.getProjectById = function (projectId: string) {
  return this.findById(projectId);
};

projectSchema.statics.getMembers = function (projectId: string) {
  return this.findById(projectId).select('members').populate('members');
};

projectSchema.statics.addMembers = function (projectId: string, memberIds: string[]) {
  return this.findByIdAndUpdate(
    projectId,
    { $addToSet: { members: { $each: memberIds } } },
    { new: true }
  );
};

projectSchema.statics.deleteMembers = function (projectId: string, memberIds: string[]) {
  return this.findByIdAndUpdate(
    projectId,
    { $pullAll: { members: memberIds } },
    { new: true }
  );
};

projectSchema.statics.deleteSprint = function (projectId: string, sprintId: string) {
  return this.findByIdAndUpdate(projectId, { $pull: { sprints: sprintId } }, { new: true });
};

projectSchema.statics.deleteRelease = function (projectId: string, releaseId: string) {
  return this.findByIdAndUpdate(projectId, { $pull: { releases: releaseId } }, { new: true });
};

projectSchema.statics.changeName = function (projectId: string, newName: string) {
  return this.findByIdAndUpdate(projectId, { $set: { name: newName } }, { new: true });
};

projectSchema.statics.getProjectsByUser = function (userId: string) {
  return this.find({
    $or: [
      { owner: new mongoose.Types.ObjectId(userId) },
      { members: new mongoose.Types.ObjectId(userId) },
    ],
  }).populate('releases').populate('sprints').populate({
    path:'releases',
    populate:{
      path:'stories'
    }
  }).exec();
};

export const ProjectModel = mongoose.model<IProject, IProjectModel>('Project', projectSchema);
