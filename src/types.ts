import { Document, Types } from 'mongoose';

export interface IAddress {
    city: string;
    state: string;
    country: string;
    street: string;
}

export interface IItemsBase {
    gender: string;
    name: string;
    address: IAddress;
    email: string;
    age: string;
    picture: string;
    createdAt: Date;
}

export interface IItems extends IItemsBase {
    id: string;
}

export interface IItemsDocument extends Document, IItemsBase {
    _id: Types.ObjectId;
}

export interface IDBConfig {
    sleepTime: number;
    requestsPerBatch: number;
    requestsPerSecond: number;
    batchSleep: number;
    apiUrl: string;
    apiParams: Record<string, any>;
}



export interface IAddress {
    city: string;
    state: string;
    country: string;
    street: string;
}

export interface IPagination {
    total: number;
    limit: number;
    page: number;
    sortBy: string;
    items: IItems[]; 

}


export interface IUserQueryParams {
    limit?: number;
    page?: number;
    sortBy?: string;
    search?: Record<string, any>;
}