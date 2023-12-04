import mongoose, { Document, Schema } from 'mongoose';
import { IStory } from './interfaces/schemas';
import { SprintModel } from './sprint';

const storySchema = new mongoose.Schema({
    sprint_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Sprint' },
    description: String,
    notes: String,
    points: Number,
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  });
  
export const StoryModel = mongoose.model<IStory>('Story', storySchema);

export interface storyInput {
  sprint_id: string;
  description: string;
  notes: string; // Assuming these are story IDs
  points: Number;
  tasks: string[]
}

export const createStory = async (storyInput: storyInput): Promise<void> =>{
  try{
    const newStory = new StoryModel({
      sprintId: new mongoose.Types.ObjectId(storyInput.sprint_id),
      description: storyInput.description,
      notes:  storyInput.notes,
      tasks: storyInput.tasks.map(taskId => new mongoose.Types.ObjectId(taskId))
    })
    const savedStory = await newStory.save();

    // Add the new release to the project
    await SprintModel.findByIdAndUpdate(
      storyInput.sprint_id,
      { $push: { sprints: savedStory._id } },
      { new: true, upsert: false }// upsert:false to avoid creating a new project if it doesn't exist
    );
    

    console.log('Sprint created and added to the project successfully.',savedStory);

  } catch (error) {
    // Handle errors here
    console.error('Error creating the sprint and adding to the project:', error);
    throw error; // Rethrow the error for further handling if necessary
  }
  
}