import mongoose, { Document, Schema } from 'mongoose';
import { IProject } from './interfaces/schemas';


const projectSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    name: {type:String,required:true},
    releases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Release' }],
    sprints: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sprint' }],
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

export const ProjectModel = mongoose.model<IProject>('Project', projectSchema);

export const getProjects = () => ProjectModel.find()

export const createProject = (values: Record <string, any> )=>new ProjectModel(values).save().then((project)=> project.toObject());


export const getProjectsByUser = (userId:string) =>{
  return ProjectModel.find({
    $or: [
      { owner: new mongoose.Types.ObjectId(userId) },
      { members: new mongoose.Types.ObjectId(userId) }
    ]
  }).exec()
};


