// // src/tests/user.service.spec.ts
// import { UserService } from '../services/user.service';
// import { User } from '../models/user.model';
// import { IItems, IPagination } from '../types';
// import mongoose from 'mongoose';

// jest.mock('../models/user.model');

// describe('UserService', () => {
//     let userService: UserService;
//     const mockUsers: IItems[] = [
//         {
//             id: new mongoose.Types.ObjectId().toString(),
//             gender: 'male',
//             name: 'John Doe',
//             address: {
//                 city: 'New York',
//                 state: 'NY',
//                 country: 'USA',
//                 street: '123 Main St'
//             },
//             email: 'john@example.com',
//             age: '30',
//             picture: 'http://example.com/pic1.jpg',
//             createdAt: new Date()
//         },
//         {
//             id: new mongoose.Types.ObjectId().toString(),
//             gender: 'female',
//             name: 'Jane Smith',
//             address: {
//                 city: 'Los Angeles',
//                 state: 'CA',
//                 country: 'USA',
//                 street: '456 Oak Ave'
//             },
//             email: 'jane@example.com',
//             age: '25',
//             picture: 'http://example.com/pic2.jpg',
//             createdAt: new Date()
//         }
//     ];

//     beforeEach(() => {
//         userService = new UserService();
//         jest.clearAllMocks();
//     });

//     describe('getUsers', () => {
//         it('should return paginated users with default parameters', async () => {
//             // Mock User.find chain
//             const mockFind = jest.fn().mockReturnThis();
//             const mockSort = jest.fn().mockReturnThis();
//             const mockSkip = jest.fn().mockReturnThis();
//             const mockLimit = jest.fn().mockResolvedValue(mockUsers);

//             (User.find as jest.Mock) = mockFind;
//             (User.find().sort as jest.Mock) = mockSort;
//             (User.find().sort().skip as jest.Mock) = mockSkip;
//             (User.find().sort().skip().limit as jest.Mock) = mockLimit;

//             (User.countDocuments as jest.Mock).mockResolvedValue(2);

//             const result = await userService.getUsers({});

//             expect(result).toEqual({
//                 total: 2,
//                 limit: 10,
//                 page: 1,
//                 sortBy: 'createdAt',
//                 items: mockUsers
//             });

//             expect(mockFind).toHaveBeenCalledWith({});
//             expect(mockSort).toHaveBeenCalledWith('createdAt');
//             expect(mockSkip).toHaveBeenCalledWith(0);
//             expect(mockLimit).toHaveBeenCalledWith(10);
//         });

//         it('should handle custom pagination parameters', async () => {
//             const mockFind = jest.fn().mockReturnThis();
//             const mockSort = jest.fn().mockReturnThis();
//             const mockSkip = jest.fn().mockReturnThis();
//             const mockLimit = jest.fn().mockResolvedValue([mockUsers[0]]);

//             (User.find as jest.Mock) = mockFind;
//             (User.find().sort as jest.Mock) = mockSort;
//             (User.find().sort().skip as jest.Mock) = mockSkip;
//             (User.find().sort().skip().limit as jest.Mock) = mockLimit;

//             (User.countDocuments as jest.Mock).mockResolvedValue(2);

//             const result = await userService.getUsers({
//                 limit: 1,
//                 page: 2,
//                 sortBy: 'name'
//             });

//             expect(result).toEqual({
//                 total: 2,
//                 limit: 1,
//                 page: 2,
//                 sortBy: 'name',
//                 items: [mockUsers[0]]
//             });

//             expect(mockFind).toHaveBeenCalledWith({});
//             expect(mockSort).toHaveBeenCalledWith('name');
//             expect(mockSkip).toHaveBeenCalledWith(1);
//             expect(mockLimit).toHaveBeenCalledWith(1);
//         });

//         it('should handle search parameters correctly', async () => {
//             const searchParams = {
//                 gender: 'female',
//                 'address.country': 'USA'
//             };

//             const mockFind = jest.fn().mockReturnThis();
//             const mockSort = jest.fn().mockReturnThis();
//             const mockSkip = jest.fn().mockReturnThis();
//             const mockLimit = jest.fn().mockResolvedValue([mockUsers[1]]);

//             (User.find as jest.Mock) = mockFind;
//             (User.find().sort as jest.Mock) = mockSort;
//             (User.find().sort().skip as jest.Mock) = mockSkip;
//             (User.find().sort().skip().limit as jest.Mock) = mockLimit;

//             (User.countDocuments as jest.Mock).mockResolvedValue(1);

//             const result = await userService.getUsers({
//                 search: searchParams
//             });

//             const expectedQuery = {
//                 gender: { $regex: 'female', $options: 'i' },
//                 'address.country': { $regex: 'USA', $options: 'i' }
//             };

//             expect(result.total).toBe(1);
//             expect(mockFind).toHaveBeenCalledWith(expectedQuery);
//         });

//         it('should handle empty search results', async () => {
//             const mockFind = jest.fn().mockReturnThis();
//             const mockSort = jest.fn().mockReturnThis();
//             const mockSkip = jest.fn().mockReturnThis();
//             const mockLimit = jest.fn().mockResolvedValue([]);

//             (User.find as jest.Mock) = mockFind;
//             (User.find().sort as jest.Mock) = mockSort;
//             (User.find().sort().skip as jest.Mock) = mockSkip;
//             (User.find().sort().skip().limit as jest.Mock) = mockLimit;

//             (User.countDocuments as jest.Mock).mockResolvedValue(0);

//             const result = await userService.getUsers({
//                 search: { name: 'NonexistentUser' }
//             });

//             expect(result).toEqual({
//                 total: 0,
//                 limit: 10,
//                 page: 1,
//                 sortBy: 'createdAt',
//                 items: []
//             });
//         });

//         it('should handle invalid page numbers gracefully', async () => {
//             const mockFind = jest.fn().mockReturnThis();
//             const mockSort = jest.fn().mockReturnThis();
//             const mockSkip = jest.fn().mockReturnThis();
//             const mockLimit = jest.fn().mockResolvedValue([]);

//             (User.find as jest.Mock) = mockFind;
//             (User.find().sort as jest.Mock) = mockSort;
//             (User.find().sort().skip as jest.Mock) = mockSkip;
//             (User.find().sort().skip().limit as jest.Mock) = mockLimit;

//             (User.countDocuments as jest.Mock).mockResolvedValue(2);

//             const result = await userService.getUsers({
//                 page: -1
//             });

//             expect(result.page).toBe(1);
//             expect(mockSkip).toHaveBeenCalledWith(0);
//         });

//         it('should handle invalid sort parameters', async () => {
//             const mockFind = jest.fn().mockReturnThis();
//             const mockSort = jest.fn().mockReturnThis();
//             const mockSkip = jest.fn().mockReturnThis();
//             const mockLimit = jest.fn().mockResolvedValue(mockUsers);

//             (User.find as jest.Mock) = mockFind;
//             (User.find().sort as jest.Mock) = mockSort;
//             (User.find().sort().skip as jest.Mock) = mockSkip;
//             (User.find().sort().skip().limit as jest.Mock) = mockLimit;

//             const result = await userService.getUsers({
//                 sortBy: 'invalidField'
//             });

//             expect(result.sortBy).toBe('invalidField');
//             expect(mockSort).toHaveBeenCalledWith('invalidField');
//         });

//         it('should handle complex search queries', async () => {
//             const complexSearch = {
//                 gender: 'male',
//                 age: '30',
//                 'address.city': 'New York',
//                 email: 'john'
//             };

//             const mockFind = jest.fn().mockReturnThis();
//             const mockSort = jest.fn().mockReturnThis();
//             const mockSkip = jest.fn().mockReturnThis();
//             const mockLimit = jest.fn().mockResolvedValue([mockUsers[0]]);

//             (User.find as jest.Mock) = mockFind;
//             (User.find().sort as jest.Mock) = mockSort;
//             (User.find().sort().skip as jest.Mock) = mockSkip;
//             (User.find().sort().skip().limit as jest.Mock) = mockLimit;

//             (User.countDocuments as jest.Mock).mockResolvedValue(1);

//             const result = await userService.getUsers({
//                 search: complexSearch
//             });

//             const expectedQuery = {
//                 gender: { $regex: 'male', $options: 'i' },
//                 age: { $regex: '30', $options: 'i' },
//                 'address.city': { $regex: 'New York', $options: 'i' },
//                 email: { $regex: 'john', $options: 'i' }
//             };

//             expect(result.total).toBe(1);
//             expect(mockFind).toHaveBeenCalledWith(expectedQuery);
//         });
//     });
// });



import Queue from 'bull';
import axios from 'axios';
import { QueueService } from '../src/services/queue.service'; // Update with your actual file path
import { User } from '../src/models/user.model'; // Update with your actual file path
import { Config } from '../src/config/database';

jest.mock('bull');
jest.mock('axios');
jest.mock('../models/user.model');
jest.mock('../config/database');

describe('QueueService', () => {
    let queueService: QueueService;
    const mockConfig = {
        apiUrl: 'https://api.example.com',
        apiParams: { parameters: { key: 'value' } },
        sleepTime: 5000,
        requestsPerSecond: 2,
        requestsPerBatch: 100,
    };

    beforeEach(() => {
        (Config.findOne as jest.Mock).mockResolvedValue(mockConfig);
        (Config.create as jest.Mock).mockResolvedValue(mockConfig);
        (Queue as jest.Mock).mockImplementation(() => ({
            add: jest.fn(),
            process: jest.fn(),
            clean: jest.fn(),
            close: jest.fn(),
        }));

        queueService = new QueueService(mockConfig);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('initializeQueue', () => {
        it('should initialize the queue with config from the database', async () => {
            await queueService['initializeQueue']();
            expect(Config.findOne).toHaveBeenCalled();
            expect(queueService['config']).toEqual(mockConfig);
        });
    });

    describe('setupQueueProcessor', () => {
        it('should set up the queue processor', () => {
            queueService['setupQueueProcessor']();
            expect(queueService['queue'].process).toHaveBeenCalled();
        });
    });

    describe('processBatch', () => {
        it('should fetch and save users in batches', async () => {
            const mockUsers = [
                {
                    login: { uuid: '123' },
                    gender: 'male',
                    name: { first: 'John', last: 'Doe' },
                    location: {
                        city: 'City',
                        state: 'State',
                        country: 'Country',
                        street: { number: 123, name: 'Street' },
                    },
                    email: 'john.doe@example.com',
                    dob: { age: 30 },
                    picture: { large: 'https://example.com/picture.jpg' },
                },
            ];

            (axios.get as jest.Mock).mockResolvedValue({ data: { results: mockUsers } });
            (User.insertMany as jest.Mock).mockResolvedValue(undefined);

            await queueServiceect(axios.get).toHaveBeenCalledWith('https://api.example.com', {
                params: {
                    results: 100,
                    key: 'value',
                },
            });

            expect(User.insertMany).toHaveBeenCalledWith([
                {
                    id: '123',
                    gender: 'male',
                    name: 'John Doe',
                    address: {
                        city: 'City',
                        state: 'State',
                        country: 'Country',
                        street: '123 Street',
                    },
                    email: 'john.doe@example.com',
                    age: 30,
                    picture: 'https://example.com/picture.jpg',
                    createdAt: expect.any(Date),
                },
            ]);
        });

        it('should handle errors during user fetching', async () => {
            (axios.get as jest.Mock).mockRejectedValue(new Error('API error'));

            const loggerSpy = jest.spyOn(queueService['logger'], 'error');

            await queueService;

            exaveBeenCalledWith(
                { error: expect.any(Error) },
                'Error fetching users'
            );
        });
    });

    describe('scheduleUserFetch', () => {
        it('should add jobs to the queue', async () => {
            const totalUsers = 500;
            await queueService.scheduleUserFetch(totalUsers);

            expect(queueService['queue'].add).toHaveBeenCalledTimes(5);
            expect(queueService['queue'].add).toHaveBeenCalledWith({ batch: expect.any(Number) });
        });
    });

    describe('cleanup', () => {
        it('should clean up the queue', async () => {
            await queueService.cleanup();

            expect(queueService['queue'].clean).toHaveBeenCalledWith(0, 'completed');
            expect(queueService['queue'].clean).toHaveBeenCalledWith(0, 'failed');
            expect(queueService['queue'].close).toHaveBeenCalled();
        });

        it('should log an error if cleanup fails', async () => {
            const error = new Error('Cleanup error');
            (queueService['queue'].clean as jest.Mock).mockRejectedValueOnce(error);

            const loggerSpy = jest.spyOn(queueService['logger'], 'error');

            await expect(queueService.cleanup()).rejects.toThrow(error);

            expect(loggerSpy).toHaveBeenCalledWith(
                { error },
                'Error cleaning up queue'
            );
        });
    });
});

