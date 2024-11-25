import mongoose from 'mongoose';

const configSchema = new mongoose.Schema({
    sleepTime: { type: Number, default: 30000 },
    requestsPerBatch: { type: Number, default: 300 },
    requestsPerSecond: { type: Number, default: 5 },
    batchSleep: { type: Number, default: 5000 },
    apiUrl: { type: String, default: 'https://randomuser.me/api' },
    apiParams: { type: Map, of: mongoose.Schema.Types.Mixed, default: {} }
});

export const Config = mongoose.model('Config', configSchema);