import mongoose, { Document, Schema } from 'mongoose';
import { ISprint } from './interfaces/schemas';
import { ProjectModel } from './project';
import { ReleaseModel } from './release';



const sprintSchema = new mongoose.Schema({
    project_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Project' },
    spikes: [String],
    release_id: { type: mongoose.Schema.Types.ObjectId,required: false, ref: 'Release' },
    stories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Story' }],
  });
  
export const SprintModel = mongoose.model<ISprint>('Sprint', sprintSchema);

export interface sprintInput {
  project_id: string;
  spikes: string[];
  release_id: string; // Assuming these are story IDs
  stories: string[];
  
}

export const createSprint = async (sprintInput: sprintInput): Promise<void> =>{
  try{
    const newSprint = new SprintModel({
      project_id: new mongoose.Types.ObjectId(sprintInput.project_id),
      spikes: sprintInput.spikes,
      release_id:  new mongoose.Types.ObjectId(sprintInput.project_id),
      stories: sprintInput.stories.map(storyId => new mongoose.Types.ObjectId(storyId))
    })
    const savedSprint = await newSprint.save();

    // Add the new release to the project
    await ProjectModel.findByIdAndUpdate(
      sprintInput.project_id,
      { $push: { sprints: savedSprint._id } },
      { new: true, upsert: false }// upsert:false to avoid creating a new project if it doesn't exist
    );

    console.log('Sprint created and added to the project successfully.',savedSprint);

  } catch (error) {
    // Handle errors here
    console.error('Error creating the sprint and adding to the project:', error);
    throw error; // Rethrow the error for further handling if necessary
  }
  
}

  