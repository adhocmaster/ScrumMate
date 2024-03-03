import express from 'express';
import {authentication, random} from '../helpers'

export const login = async (req: express.Request, res: express.Response) => {
    try {
        // Extract email and password from the request body
        const { email, password } = req.body;

        // Check if email or password is missing, return a 400 Bad Request status if either is missing
        if (!email || !password) {
            return res.sendStatus(400);
        }

        // Get the user by email and select additional fields (salt and password)
        const user =  await UserModel.findOne({email}).select('+authentication.salt +authentication.password');

        // If no user with the provided email is found, return a 400 Bad Request status
        if (!user) {
            return res.sendStatus(400);
        }

        // Calculate the expected hash of the password using the user's salt
        const expectedHash = authentication(user.authentication.salt, password);

        // Check if the calculated hash matches the stored hash, return a 403 Forbidden status if not
        if (user.authentication.password !== expectedHash) {
            return res.sendStatus(403);
        }

        // If the user's authentication matches the expected hash, update the session token
        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());

        // Save the updated user with the new session token
        await user.save();

        // Save the user's session token as a cookie (user-auth)
        res.cookie('user-auth', user.authentication.sessionToken, { domain: "localhost", path: "/" });

        // Return a 200 OK status along with the user data in JSON format
        return res.status(200).json(user).end();

    } catch (error) {
        // Handle any errors that may occur during the login process and return a 400 Bad Request status
        console.log(error);
        return res.sendStatus(400);
    }
}


// Function for user registration
export const register = async (req: express.Request, res: express.Response) => {
    try {
        // Extract email, password, and username from the request body
        const { email, password, username } = req.body;

        // Check if any of the required fields (email, password, username) is missing
        // Return a 400 Bad Request status if any field is missing
        if (!email || !password || !username) {
            return res.sendStatus(400);
        }

        // Check if a user with the provided email already exists
        const existingUser = await UserModel.getUserByEmail(email);

        // If a user with the provided email exists, return a 400 Bad Request status
        if (existingUser) {
            return res.sendStatus(400);
        }

        // Generate a random salt for password hashing
        const salt = random();

        // Create a new user with the provided email, username, and hashed password
        const user = await UserModel.createUser({
            email,
            username,
            authentication: {
                salt,
                password: authentication(salt, password)
            }
        });

        // Return a 200 OK status along with the newly created user data in JSON format
        return res.status(200).json(user).end();

    } catch (error) {
        // Handle any errors that may occur during the registration process
        // Return a 400 Bad Request status in case of an error
        console.log(error);
        return res.sendStatus(400);
    }
}