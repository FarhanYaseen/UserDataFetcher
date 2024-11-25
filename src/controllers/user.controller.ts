import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { IUserQueryParams } from '../types';

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();

    }
    public getUsers = async (req: Request, res: Response) => {
        try {
            const { limit = 10, page = 1, sortBy = 'createdAt', search = '{}' } = req.query;
            const params: IUserQueryParams = {
                limit: Number(limit),
                page: Number(page),
                sortBy: sortBy as string,
                search: search ? JSON.parse(search as string) : {}
            };

            const result = await this.userService.getUsers(params);
            res.json(result);
        } catch (error) {
            console.error({error})
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
