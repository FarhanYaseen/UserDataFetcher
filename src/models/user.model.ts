import mongoose from 'mongoose';
import { IItemsDocument, IAddress } from '../types';

const addressSchema = new mongoose.Schema<IAddress>({
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    street: { type: String, required: true }
});

const userSchema = new mongoose.Schema<IItemsDocument>({
    gender: { type: String, required: true },
    name: { type: String, required: true },
    address: { type: addressSchema, required: true },
    email: { type: String, required: true },
    age: { type: String, required: true },
    picture: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model<IItemsDocument>('User', userSchema);