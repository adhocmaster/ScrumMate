import * as chai from 'chai';
import { UserModel } from '../db/user';
import { UserController } from '../controllers/user';

const expect = chai.expect;

describe('User Controller', () => {
    beforeEach(async () => {
        
        await UserModel.deleteMany({});
    });

    describe('getAllUsers', () => {
        it('should get all users', async () => {
            // Add test data to the database
            await UserModel.create({
                username: 'user1',
                email: 'user1@example.com',
                authentication: {
                    password: 'password1',
                    salt: 'salt1',
                    sessionToken: 'token1',
                },
                friends: [],
            });

            await UserModel.create({
                username: 'user2',
                email: 'user2@example.com',
                authentication: {
                    password: 'password2',
                    salt: 'salt2',
                    sessionToken: 'token2',
                },
                friends: [],
            });

            // Mock the express.Request and express.Response objects
            const req: any = {};
            const res: any = {
                status: (statusCode: number) => res,
                json: (data: any) => data,
            };

            
            const result = await UserController.getAllUsers(req, res);

            // Assert the result
            expect(res.status).to.equal(200);
            expect(result).to.be.an('array');
            expect(result).to.have.lengthOf(2);
        });
    });

    describe('deleteUser', () => {
        it('should delete a user by ID', async () => {
            // Add test data to the database
            const user = await UserModel.create({
                username: 'user1',
                email: 'user1@example.com',
                authentication: {
                    password: 'password1',
                    salt: 'salt1',
                    sessionToken: 'token1',
                },
                friends: [],
            });

            
            const req: any = {
                params: { id: user._id },
            };
            const res: any = {
                status: (statusCode: number) => res,
                json: (data: any) => data,
            };

            
            const result = await UserController.deleteUser(req, res);

            
            expect(res.status).to.equal(200);
            expect(result).to.deep.equal(user.toObject());

            
            const deletedUser = await UserModel.findById(user._id);
            expect(deletedUser).to.be.null;
        });
    });
    describe('updateUser', () => {
        it('should update a user by ID', async () => {
            
            const user = await UserModel.create({
                username: 'user1',
                email: 'user1@example.com',
                authentication: {
                    password: 'password1',
                    salt: 'salt1',
                    sessionToken: 'token1',
                },
                friends: [],
            });

           
            const req: any = {
                params: { id: user._id },
                body: { username: 'newUsername' },
            };
            const res: any = {
                status: (statusCode: number) => res,
                json: (data: any) => data,
            };

           
            const result = await UserController.updateUser(req, res);

           
            expect(res.status).to.equal(200);
        
            const updatedUser = await UserModel.findById(user._id);
            expect(updatedUser?.username).to.equal('newUsername');
        });

        it('should return status 400 if no username provided', async () => {
            // Add test data to the database
            const user = await UserModel.create({
                username: 'user1',
                email: 'user1@example.com',
                authentication: {
                    password: 'password1',
                    salt: 'salt1',
                    sessionToken: 'token1',
                },
                friends: [],
            });

            
            const req: any = {
                params: { id: user._id },
                body: {},
            };
            const res: any = {
                status: (statusCode: number) => res,
                sendStatus: (statusCode: number) => statusCode,
            };

            
            const result = await UserController.updateUser(req, res);

            // Assert the result
            expect(result).to.equal(400);

            // Assert the user is not updated in the database
            const notUpdatedUser = await UserModel.findById(user._id);
            expect(notUpdatedUser?.username).to.equal('user1');
        });
    });
    
});
