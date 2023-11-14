import mongoose, { Document, Schema } from 'mongoose';

export interface ReleaseInput {
    projectId: string;
    highLevelGoals: string[];
    stories: string[]; // Assuming these are story IDs
    dateFinalized: Date;
    status: string;
}

export interface ProjectInput {
    owner: string;
    name:string;
    releases: string[]; // Assuming these are release IDs
    members: string[];  // Assuming these are  IDs
    sprints: string[];
}

export interface StoryInput {
    sprint_id: string;
    description:string;
    notes: string; 
    points: number;  
    tasks: string[];// Assuming these are  IDs
}

export interface UserInput {
    username: string;
    email:string;
    authentication:{
        password:string;
        salt:string;
        sessionToken:string;
    }
    friends: string[];// Assuming these are  IDs
}
