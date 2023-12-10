import express from "express";
import { UserModel } from "../db/user";

export class UserController {
    static async getAllUsers(req: express.Request, res: express.Response) {
        try {
            const users = await UserModel.getUsers();
            return res.status(200).json(users);
        } catch (error) {
            console.log(error);
            return res.sendStatus(400);
        }
    }

    static async deleteUser(req: express.Request, res: express.Response) {
        try {
            const { id } = req.params;
            const deletedUser = await UserModel.deleteUserById(id);
            return res.json(deletedUser);
        } catch (error) {
            console.log(error);
            return res.sendStatus(400);
        }
    }

    static async updateUser(req: express.Request, res: express.Response) {
        try {
            const { id } = req.params;
            const { username } = req.body;

            if (!username) {
                res.sendStatus(400);
            }

            const user = await UserModel.getUserById(id);
            user.username = username;
            await user.save();

            return res.status(200).json(user);
        } catch (error) {
            console.log(error);
            return res.sendStatus(400);
        }
    }
}
