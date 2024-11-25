import Queue from 'bull';
import { Config } from '../models/config.model';
import { User } from '../models/user.model';
import axios from 'axios';
import { IDBConfig } from '../types';
import pino from 'pino';

export class QueueService {
    private queue: Queue.Queue;
    private config: IDBConfig;
    private logger: pino.Logger;

    constructor(config: IDBConfig) {
        this.config = config;
        this.logger = pino({
            level: process.env.LOG_LEVEL || 'info',
            formatters: {
                level(label) {
                    return { level: label };
                },
            },
            timestamp: pino.stdTimeFunctions.isoTime,
        });

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
        this.logger.info(`Batch Number: ${batchNumber}`)

        const totalUsers = 5000;
        const usersPerRequest = 100;
        const maxRequestsBeforeSleep = 5;
        const sleepTime = this.config.sleepTime;
        const requestsPerSecond = this.config.requestsPerSecond;
        let usersFetched = 0;
        let totalRequestsMade = 0;

        while (usersFetched < totalUsers) {
            for (let i = 0; i < maxRequestsBeforeSleep && usersFetched < totalUsers; i++) {
                const remainingUsers = totalUsers - usersFetched;
                const results = remainingUsers >= usersPerRequest ? usersPerRequest : remainingUsers;
                const params = {
                    results,
                    ...this.config.apiParams.parameters,
                };
                const apiUrl = this.config.apiUrl;

                try {
                    const response = await axios.get(apiUrl, { params });
                    const usersData = response.data.results;

                    const usersToSave = usersData.map((user: any) => ({
                        id: user.login.uuid,
                        gender: user.gender,
                        name: `${user.name.first} ${user.name.last}`,
                        address: {
                            city: user.location.city,
                            state: user.location.state,
                            country: user.location.country,
                            street: `${user.location.street.number} ${user.location.street.name}`,
                        },
                        email: user.email,
                        age: user.dob.age,
                        picture: user.picture.large,
                        createdAt: new Date(),
                    }));

                    await User.insertMany(usersToSave);

                    usersFetched += results;
                    totalRequestsMade++;

                    await new Promise((resolve) => setTimeout(resolve, 1000 / requestsPerSecond));
                } catch (error) {
                    this.logger.error({ error }, 'Error fetching users');
                }
            }
            this.logger.info(`Sleeping for ${sleepTime / 1000} seconds...`);
            await new Promise((resolve) => setTimeout(resolve, sleepTime));
        }
    }

    public async scheduleUserFetch(totalUsers: number) {
        const batches = Math.ceil(totalUsers / this.config.requestsPerBatch);
        for (let i = 0; i < batches; i++) {
            await this.queue.add({ batch: i });
        }
    }

    public async cleanup(): Promise<void> {
        try {
            await this.queue.clean(0, 'completed');
            await this.queue.clean(0, 'failed');
            await this.queue.close();
        } catch (error) {
            this.logger.error({ error }, 'Error cleaning up queue');
            throw error;
        }
    }
}