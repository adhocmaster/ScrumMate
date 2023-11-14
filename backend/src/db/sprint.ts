import mongoose, { Document, Schema } from 'mongoose';
import { ISprint } from './interfaces/schemas';


const sprintSchema = new mongoose.Schema({
    project_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Project' },
    spikes: [String],
    release_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Release' },
    stories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Story' }],
  });
  
export const SprintModel = mongoose.model<ISprint>('Sprint', sprintSchema);
  