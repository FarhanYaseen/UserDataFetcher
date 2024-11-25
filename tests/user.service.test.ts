import { UserService } from '../src/services/user.service';
import { User } from '../src/models/user.model';
import mongoose from 'mongoose';
import { IUserQueryParams, IPagination } from '../src/types';
import { jest } from '@jest/globals';

jest.mock('../src/models/user.model');

describe('UserService', () => {
    let userService: UserService;

    beforeAll(() => {
        userService = new UserService();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getUsers', () => {
        it('should return paginated user data', async () => {
            const mockUsers = [
                {
                    _id: new mongoose.Types.ObjectId(),
                    gender: 'male',
                    name: 'John Doe',
                    address: {
                        city: 'New York',
                        state: 'NY',
                        country: 'USA',
                        street: '123 Main St',
                    },
                    email: 'johndoe@example.com',
                    age: 30,
                    picture: 'http://example.com/picture.jpg',
                    createdAt: new Date(),
                },
            ];

            // Mock chainable methods on User.find
            const mockFind = {
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue(mockUsers as never),
            };

            (User.countDocuments as jest.Mock).mockResolvedValue(1 as never);
            (User.find as jest.Mock).mockReturnValue(mockFind);

            const params: IUserQueryParams = { limit: 10, page: 1, sortBy: 'createdAt' };
            const result: IPagination = await userService.getUsers(params);

            expect(User.countDocuments).toHaveBeenCalledWith({});
            expect(User.find).toHaveBeenCalledWith({});
            expect(mockFind.sort).toHaveBeenCalledWith('createdAt');
            expect(mockFind.skip).toHaveBeenCalledWith(0);
            expect(mockFind.limit).toHaveBeenCalledWith(10);
            expect(result).toEqual({
                total: 1,
                limit: 10,
                page: 1,
                sortBy: 'createdAt',
                items: [
                    {
                        id: mockUsers[0]._id.toString(),
                        gender: mockUsers[0].gender,
                        name: mockUsers[0].name,
                        address: mockUsers[0].address,
                        email: mockUsers[0].email,
                        age: mockUsers[0].age,
                        picture: mockUsers[0].picture,
                        createdAt: mockUsers[0].createdAt,
                    },
                ],
            });
        });

        it('should build a search query and return the filtered users', async () => {
            const mockUsers = [
                {
                    _id: new mongoose.Types.ObjectId(),
                    gender: 'female',
                    name: 'Jane Doe',
                    address: {
                        city: 'Los Angeles',
                        state: 'CA',
                        country: 'USA',
                        street: '456 Main St',
                    },
                    email: 'janedoe@example.com',
                    age: 28,
                    picture: 'http://example.com/picture.jpg',
                    createdAt: new Date(),
                },
            ];

            const search = { name: 'Jane' };

            // Mock chainable methods on User.find
            const mockFind = {
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue(mockUsers as never),
            };

            (User.countDocuments as jest.Mock).mockResolvedValue(1 as never);
            (User.find as jest.Mock).mockReturnValue(mockFind);

            const params: IUserQueryParams = { limit: 10, page: 1, sortBy: 'createdAt', search };
            const result: IPagination = await userService.getUsers(params);

            expect(User.countDocuments).toHaveBeenCalledWith({ name: { $regex: 'Jane', $options: 'i' } });
            expect(User.find).toHaveBeenCalledWith({ name: { $regex: 'Jane', $options: 'i' } });
            expect(mockFind.sort).toHaveBeenCalledWith('createdAt');
            expect(mockFind.skip).toHaveBeenCalledWith(0);
            expect(mockFind.limit).toHaveBeenCalledWith(10);
            expect(result.items.length).toBe(1);
            expect(result.items[0].name).toBe('Jane Doe');
        });
    });
});
