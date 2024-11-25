import Queue from 'bull';
import { Config } from '../config/database';
import { User } from '../models/user.model';
import axios from 'axios';
import { IDBConfig } from '../types';

export class QueueService {
    private queue: Queue.Queue;
    private config: IDBConfig;


    constructor(config: IDBConfig) {
        this.config = config;
        this.queue = new Queue('userFetcher', {
            redis: process.env.REDIS_URL
        });
        this.initializeQueue();
    }

    private async initializeQueue() {
        this.config = await Config.findOne() || await Config.create({});
        this.setupQueueProcessor();
    }

    private setupQueueProcessor() {
        this.queue.process(async (job) => {
            const { batch } = job.data;
            await this.processBatch(batch);
        });
    }

    private async processBatch(batchNumber: number) {
        const startIndex = batchNumber * this.config.requestsPerBatch;
        const requests = [];

        for (let i = 0; i < this.config.requestsPerBatch; i += this.config.requestsPerSecond) {
            const batchRequests = [];
            for (let j = 0; j < this.config.requestsPerSecond && i + j < this.config.requestsPerBatch; j++) {
                batchRequests.push(this.fetchUsers());
            }
            requests.push(...batchRequests);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        const results = await Promise.all(requests);
        await this.saveUsers(results.flat());
        await new Promise(resolve => setTimeout(resolve, this.config.batchSleep));
    }

    private async fetchUsers() {
        try {
            const response = await axios.get(`${this.config.apiUrl}`, {
                params: { ...this.config.apiParams, results: 1 }
            });
            return response.data.results;
        } catch (error) {
            console.error('Error fetching users:', error);
            return [];
        }
    }

    private async saveUsers(users: any[]) {
        const formattedUsers = users.map(user => ({
            gender: user.gender,
            name: `${user.name.first} ${user.name.last}`,
            address: {
                city: user.location.city,
                state: user.location.state,
                country: user.location.country,
                street: user.location.street.name
            },
            email: user.email,
            age: user.dob.age.toString(),
            picture: user.picture.large
        }));

        await User.insertMany(formattedUsers);
    }

    public async scheduleUserFetch(totalUsers: number) {
        const batches = Math.ceil(totalUsers / this.config.requestsPerBatch);
        for (let i = 0; i < batches; i++) {
            await this.queue.add({ batch: i });
        }
    }
}