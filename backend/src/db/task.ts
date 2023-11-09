import mongoose, { Document, Schema } from 'mongoose';
import { ITask } from './interfaces/schemas';

export const taskSchema = new mongoose.Schema({
    stories_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Story' },
    description: String,
    points: Number,
    user_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});