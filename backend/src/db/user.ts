import mongoose from "mongoose";
import { IUser } from "./interfaces/schemas";

const UserSchema = new mongoose.Schema({
    username:{type:String, required:true, unique:true},
    email:{type:String, required:true},
    authentication:{
        password:{type:String, required:true, select:false},
        salt:{type:String, select:false},
        sessionToken:{type:String,select:false }
    },
    friends:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
})

export const UserModel = mongoose.model<IUser>('User', UserSchema);


// Get users
export const getUsers = ()=> UserModel.find()

export const getUserByEmail = (email:string)=>UserModel.findOne({email})

export const getUserBySesssionToken = (sessionToken: string)=>UserModel.findOne({'authentication.sessionToken': sessionToken,});

export const getUserById = (id:string)=> UserModel.findById(id)


// Create and delete
export const createUser = (values: Record <string, any> )=>new UserModel(values).save().then((user)=> user.toObject());

export const deleteUserById = (id:string)=>  UserModel.findOneAndDelete({_id:id})

// Update users

export const updateUserById = (id: string, values:  Record <string, any>) => UserModel.findByIdAndUpdate(id,values)

export const addFriend = (id:string, friendId:string) =>{
    UserModel.findByIdAndUpdate(id,{
        $push:{
            friends:friendId
        }
    })

}