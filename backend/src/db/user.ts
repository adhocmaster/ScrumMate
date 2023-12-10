// import mongoose from "mongoose";
// import { IUser } from "./interfaces/schemas";

// const UserSchema = new mongoose.Schema({
//     username:{type:String, required:true, unique:true},
//     email:{type:String, required:true},
//     authentication:{
//         password:{type:String, required:true, select:false},
//         salt:{type:String, select:false},
//         sessionToken:{type:String,select:false }
//     },
//     friends:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
// })

// export const UserModel = mongoose.model<IUser>('User', UserSchema);


// // Get users
// export const getUsers = ()=> UserModel.find()

// export const getUserByEmail = (email:string)=>UserModel.findOne({email})

// export const getUserBySesssionToken = (sessionToken: string)=>UserModel.findOne({'authentication.sessionToken': sessionToken,});

// export const getUserById = (id:string)=> UserModel.findById(id)


// // Create and delete
// export const createUser = (values: Record <string, any> )=>new UserModel(values).save().then((user)=> user.toObject());

// export const deleteUserById = (id:string)=>  UserModel.findOneAndDelete({_id:id})

// // Update users

// export const updateUserById = (id: string, values:  Record <string, any>) => UserModel.findByIdAndUpdate(id,values)

// export const addFriend = (id:string, friendId:string) =>{
//     UserModel.findByIdAndUpdate(id,{
//         $push:{
//             friends:friendId
//         }
//     })

// }
import mongoose, { Model } from "mongoose";
import { IUser, IUserModel } from "./interfaces/schemas";


// Define the User Schema
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    authentication: {
        password: { type: String, required: true, select: false },
        salt: { type: String, select: false },
        sessionToken: { type: String, select: false }
    },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});


export const UserModel = mongoose.model<IUser, IUserModel>('User', UserSchema);

// Function to get all users
UserModel.getUsers = function () {
    return this.find();
};

// Function to get a user by email
UserModel.getUserByEmail = function (email: string) {
    return this.findOne({ email });
};

// Function to get a user by session token
UserModel.getUserBySessionToken = function (sessionToken: string) {
    return this.findOne({ 'authentication.sessionToken': sessionToken });
};

// Function to get a user by ID
UserModel.getUserById = function (id: string) {
    return this.findById(id);
};

// Function to create a new user
UserModel.createUser = function (values: Record<string, any>) {
    return this.create(values);
};

// Function to delete a user by ID
UserModel.deleteUserById = function (id: string) {
    return this.findOneAndDelete({ _id: id });
};

// Function to update a user by ID
UserModel.updateUserById = function (id: string, values: Record<string, any>) {
    return this.findByIdAndUpdate(id, values, { new: true });
};

// Function to add a friend to a user's friends list
UserModel.addFriend = function (id: string, friendId: string) {
    return this.findByIdAndUpdate(id, {
        $push: {
            friends: friendId
        }
    });
};
UserModel.findUserIdsByEmails = async function(emailsArray) {
    try {
      const userIds = await this.find({ email: { $in: emailsArray } }).select('_id');
      return userIds.map((user:IUser) => user._id);
    } catch (error) {
      throw error;
    }
  }