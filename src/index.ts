require('dotenv').config()


import mongoose from 'mongoose';
import { QueueService } from './services/queue.service';
import express from 'express';
import { UserController } from './controllers/user.controller';
import { IDBConfig } from './types';

async function main() {
    await mongoose.connect(process.env.MONGODB_URI as string);

    const configInstance: IDBConfig = {
        sleepTime: 30000,
        requestsPerBatch: 300,
        requestsPerSecond: 5,
        batchSleep: 5000,
        apiUrl: 'https://randomuser.me/api',
        apiParams: {}
    };
    // Initialize Queue Service
    const queueService = new QueueService(configInstance);
    await queueService.scheduleUserFetch(5000);

    const app = express();
    const userController = new UserController();

    app.get('/users', userController.getUsers);

    app.listen(3000, () => {
        console.log('Server running on port 3000');
    });
    process.on('SIGTERM', async () => {
        await queueService.cleanup();
    });
}

main().catch(console.error);