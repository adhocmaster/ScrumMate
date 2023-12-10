import mongoose, { Document, Schema, Model } from 'mongoose';


// Export all of the interfaces for the schemas
export interface IProject extends Document {
    owner: mongoose.Types.ObjectId;
    name: string;
    releases: mongoose.Types.ObjectId[];
    sprints: mongoose.Types.ObjectId[];
    members: mongoose.Types.ObjectId[];
}

export interface IStory extends Document {
    sprint_id: mongoose.Types.ObjectId;
    description: string;
    notes: string;
    points: number;
    tasks: mongoose.Types.ObjectId[];
}

export interface ISprint extends Document {
    project_id: mongoose.Types.ObjectId;
    spikes: string[];
    release_id: mongoose.Types.ObjectId;
    stories: mongoose.Types.ObjectId[];
}

export interface ITask extends Document {
    stories_id: mongoose.Types.ObjectId;
    description: string;
    points: number;
    user_id: mongoose.Types.ObjectId[];
}

export interface IUser extends Document {
    username: string;
    email: string;
    authentication:{
        password:string;
        salt:string;
        sessionToken:string;
    },
    friends: mongoose.Types.ObjectId[];
}

export interface IUserModel extends Model<IUser> {
    getUsers: () => Promise<IUser[]>;
    getUserByEmail: (email: string) => Promise<IUser | null>;
    getUserBySessionToken: (sessionToken: string) => Promise<IUser | null>;
    getUserById: (id: string) => Promise<IUser | null>;
    createUser: (values: Record<string, any>) => Promise<IUser>;
    deleteUserById: (id: string) => Promise<IUser | null>;
    updateUserById: (id: string, values: Record<string, any>) => Promise<IUser | null>;
    addFriend: (id: string, friendId: string) => Promise<void>;
    findUserIdsByEmails: (emailsArray: string[]) => Promise<string[]>;

}

export interface IRelease extends Document {
    project_id: mongoose.Types.ObjectId;
    high_level_goals: string[];
    stories: mongoose.Types.ObjectId[];
    date_finalized: Date;
    status: string;
}
