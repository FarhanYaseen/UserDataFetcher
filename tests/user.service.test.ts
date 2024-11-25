import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import mongoose from 'mongoose';

jest.mock('../models/user.model');

describe('UserService', () => {
    let userService: UserService;

    beforeEach(() => {
        userService = new UserService();
        jest.clearAllMocks();
    });

    describe('getUsers', () => {
        it('should return paginated users with default parameters', async () => {
            const mockUsers = [{ name: 'Test User' }];
            const mockCount = 1;

            (User.countDocuments as jest.Mock).mockResolvedValue(mockCount);
            (User.find as jest.Mock).mockReturnValue({
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue(mockUsers)
            });

            const result = await userService.getUsers({});

            expect(result).toEqual({
                total: mockCount,
                limit: 10,
                page: 1,
                sortBy: 'createdAt',
                items: mockUsers
            });
        });

        it('should apply search filters correctly', async () => {
            const searchParams = { name: 'John', 'address.country': 'USA' };
            await userService.getUsers({ search: searchParams });

            expect(User.find).toHaveBeenCalledWith({
                name: { $regex: 'John', $options: 'i' },
                'address.country': { $regex: 'USA', $options: 'i' }
            });
        });
    });
});