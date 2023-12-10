
// import mongoose, { Document, Schema } from 'mongoose';
// import { ProjectModel } from './project';
// import { IRelease } from './interfaces/schemas';

// const releaseSchema = new mongoose.Schema({
//     project_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Project' },
//     high_level_goals: [String],
//     stories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Story' }],
//     date_finalized: Date,
//     status: String,
// });
  
// export const ReleaseModel = mongoose.model<IRelease>('Release', releaseSchema);

// export interface ReleaseInput {
//     projectId: string;
//     highLevelGoals: string[];
//     stories: string[]; // Assuming these are story IDs
//     dateFinalized: Date;
//     status: string;
// }

// export const createReleasePlan = async (releaseInput: ReleaseInput): Promise<void> =>{
//     try{
//       const newRelease = new ReleaseModel({
//         project_id: new mongoose.Types.ObjectId(releaseInput.projectId),
//         high_level_goals: releaseInput.highLevelGoals,
//         stories: releaseInput.stories.map(storyId => new mongoose.Types.ObjectId(storyId)),
//         date_finalized: releaseInput.dateFinalized,
//         status: releaseInput.status,
//       })
//       const savedRelease = await newRelease.save();

//       // Add the new release to the project
//       await ProjectModel.findByIdAndUpdate(
//         releaseInput.projectId,
//         { $push: { releases: savedRelease._id } },
//         { new: true, upsert: false }// upsert:false to avoid creating a new project if it doesn't exist
        
//       );
//       console.log('Release created and added to the project successfully.',savedRelease);

//     } catch (error) {
//       // Handle errors here
//       console.error('Error creating the release and adding to the project:', error);
//       throw error; // Rethrow the error for further handling if necessary
//     }
    
// }
  

// export const getReleaseById = (id:string)=> ReleaseModel.findById(id)

// export const updateReleaseStatus = (id: string, values: string) => ReleaseModel.findByIdAndUpdate(id,{status:values})

import mongoose, { Document, Schema, Model } from 'mongoose';
import { ProjectModel } from './project';
import { IRelease } from './interfaces/schemas';

// Define the Release Schema
const releaseSchema = new mongoose.Schema({
    project_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Project' },
    high_level_goals: [String],
    stories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Story' }],
    date_finalized: Date,
    status: String,
});

// Create the ReleaseModel class
interface IReleaseModel extends Model<IRelease> {
    createReleasePlan: (releaseInput: ReleaseInput) => Promise<void>;
    getReleaseById: (id: string) => Promise<IRelease | null>;
    updateReleaseStatus: (id: string, values: string) => Promise<IRelease | null>;
}

export const ReleaseModel = mongoose.model<IRelease, IReleaseModel>('Release', releaseSchema);

// Function to create a new release plan
ReleaseModel.createReleasePlan = async (releaseInput: ReleaseInput): Promise<void> => {
    try {
        const newRelease = new ReleaseModel({
            project_id: new mongoose.Types.ObjectId(releaseInput.projectId),
            high_level_goals: releaseInput.highLevelGoals,
            stories: releaseInput.stories.map(storyId => new mongoose.Types.ObjectId(storyId)),
            date_finalized: releaseInput.dateFinalized,
            status: releaseInput.status,
        });

        const savedRelease = await newRelease.save();

        await ProjectModel.findByIdAndUpdate(
            releaseInput.projectId,
            { $push: { releases: savedRelease._id } },
            { new: true, upsert: false }
        );

        console.log('Release created and added to the project successfully.', savedRelease);
    } catch (error) {
        console.error('Error creating the release and adding to the project:', error);
        throw error;
    }
};

// Function to get a release by ID
ReleaseModel.getReleaseById = function (id: string): mongoose.Query<IRelease | null, IRelease, {}> {
    return this.findById(id);
};

// Function to update the status of a release by ID
ReleaseModel.updateReleaseStatus = function (id: string, values: string): mongoose.Query<IRelease | null, IRelease, {}> {
    return this.findByIdAndUpdate(id, { status: values });
};

export interface ReleaseInput {
    projectId: string;
    highLevelGoals: string[];
    stories: string[]; // Assuming these are story IDs
    dateFinalized: Date;
    status: string;
}
