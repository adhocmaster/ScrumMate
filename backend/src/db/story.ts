import mongoose, { Document, Schema } from 'mongoose';
import { IStory } from './interfaces/schemas';


const storySchema = new mongoose.Schema({
    sprint_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Sprint' },
    description: String,
    notes: String,
    points: Number,
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  });
  
export const StoryModel = mongoose.model<IStory>('Story', storySchema);