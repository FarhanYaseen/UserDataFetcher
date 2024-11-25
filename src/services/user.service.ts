import { User } from "../models/user.model";
import { IItems, IPagination, IUserQueryParams } from "../types";

export class UserService {
    public async getUsers(params: IUserQueryParams): Promise<IPagination> {
        const {
            limit = 10,
            page = 1,
            sortBy = 'createdAt',
            search = {}
        } = params;

        const query = this.buildSearchQuery(search);
        const skip = (page - 1) * limit;

        const [total, documents] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .sort(sortBy)
                .skip(skip)
                .limit(limit)
        ]);

        const items: IItems[] = documents.map(doc => ({
            id: doc._id.toString(),
            gender: doc.gender,
            name: doc.name,
            address: {
                city: doc.address.city,
                state: doc.address.state,
                country: doc.address.country,
                street: doc.address.street,
            },
            email: doc.email,
            age: doc.age,
            picture: doc.picture,
            createdAt: doc.createdAt
        }));

        return {
            total,
            limit,
            page,
            sortBy,
            items
        };
    }

    private buildSearchQuery(search: Record<string, any>) {
        const query: Record<string, any> = {};

        Object.entries(search).forEach(([key, value]) => {
            if (typeof value === 'string') {
                query[key] = { $regex: value, $options: 'i' };
            } else {
                query[key] = value;
            }
        });

        return query;
    }
}