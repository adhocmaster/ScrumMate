import mongoose, { Document, Schema } from 'mongoose';
import { ITask } from './interfaces/schemas';
import { StoryModel } from './story';

const taskSchema = new mongoose.Schema({
    stories_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Story' },
    description: String,
    points: Number,
    user_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

export const TaskModel = mongoose.model<ITask>('Story', taskSchema);

export interface taskInput {
    stories_id: string;
    description: string;
    points: Number;
    user_id: string[]
}


export const createTask = async (taskInput: taskInput): Promise<void> =>{
    try{
      console.log()
      const newTask = new TaskModel({
        stories_id: new mongoose.Types.ObjectId(taskInput.stories_id),
        description:  taskInput.description,
        user_id: taskInput.user_id.map(userId => new mongoose.Types.ObjectId(userId))
      })
      const savedTask = await newTask.save();
  
      // Add the new release to the project
      await StoryModel.findByIdAndUpdate(
        taskInput.stories_id,
        { $push: { task: savedTask._id } },
        { new: true, upsert: false }// upsert:false to avoid creating a new project if it doesn't exist
      );
      
  
      console.log('Task created and added to the sprint successfully.',savedTask);
  
    } catch (error) {
      // Handle errors here
      console.error('Error creating the task and adding to the sprint:', error);
      throw error; // Rethrow the error for further handling if necessary
    }
    
  }