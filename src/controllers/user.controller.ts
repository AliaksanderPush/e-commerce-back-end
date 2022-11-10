import { UserService } from './../service/user.service';
import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../common/base.controller';
import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import 'reflect-metadata';

@injectable()
export class UserController extends BaseController {
	constructor(@inject(TYPES.UserService) protected userService: UserService) {
		super();
		this.bindRouters([
			{ path: '/user', methot: 'get', func: this.getUsers },

			{
				path: '/user/:id',
				methot: 'put',
				func: this.updateUser,
				middlewares: [],
			},
			{
				path: '/user/:id',
				methot: 'delete',
				func: this.removeUser,
				middlewares: [],
			},
		]);
	}

	async getUsers(req: Request, res: Response, next: NextFunction) {
		const result = await this.userService.getAll();
		res.json(result);
	}

	async updateUser(req: Request, res: Response, next: NextFunction) {
		const id = req.params.id;
		const data = req.body;
		const response = await this.userService.putUser(id, data);
		if (!response) {
			this.send(res, 400, 'This user is not exist');
			return;
		}
		const { roles, email } = response;
		const tokens = await this.userService.generateAndSaveTokens(id, email, roles as string[]);
		this.ok(res, {
			token: { accesToken: tokens.accesToken, refreshToken: tokens.refreshToken },
			searchUser: response,
		});
		return;
	}

	async removeUser(req: Request, res: Response, next: NextFunction) {
		const id = req.params.id;
		await this.userService.deleteUser(id);
		this.ok(res, 'User was delated');
	}
}
