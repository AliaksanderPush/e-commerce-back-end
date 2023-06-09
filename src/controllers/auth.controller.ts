import { AuthService } from '../service/auth.service';
import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../common/base.controller';
import { injectable, inject } from 'inversify';
import { TYPES } from '../types';
import 'reflect-metadata';
import { UserLogin, UserRegister } from '../dto/user.dto';
import { ValidateMidleWare } from '../middlewares/validate.middleware';

@injectable()
export class AuthController extends BaseController {
	constructor(@inject(TYPES.AuthService) protected userService: AuthService) {
		super();
		this.bindRouters([
			{
				path: '/login',
				methot: 'post',
				func: this.login,
				middlewares: [new ValidateMidleWare(UserLogin)],
			},
			{
				path: '/register',
				methot: 'post',
				func: this.register,
				middlewares: [new ValidateMidleWare(UserRegister)],
			},
			{
				path: '/regist',
				methot: 'get',
				func: this.test,
				middlewares: [],
			},
		]);
	}

	async test(req: Request<{}, {}, UserLogin>, res: Response, next: NextFunction) {
		this.ok(res, {
			message: 'Hello!',
		});
	}

	async login(req: Request<{}, {}, UserLogin>, res: Response, next: NextFunction): Promise<void> {
		const { email, password } = req.body;
		const searchUser = await this.userService.searchByEmail(email);

		if (searchUser) {
			const result = await this.userService.comparePassword(password, searchUser.password);

			if (!result) {
				this.send(res, 400, 'Email or password does not match!!');
				return;
			}
			const id = searchUser._id;
			const role = searchUser.roles;
			const tokens = await this.userService.generateAndSaveTokens(id, email, role);
			this.ok(res, {
				token: { accesToken: tokens.accesToken, refreshToken: tokens.refreshToken },
				user: searchUser,
			});

			return;
		} else {
			this.send(res, 400, 'User does not auchorization');
			return;
		}
	}

	async register(
		req: Request<{}, {}, UserRegister>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const { email, password, confirmPassword } = req.body;
		if (password !== confirmPassword) {
			this.send(res, 401, 'Passwords do not match!');
			return;
		}
		const result = await this.userService.searchByEmail(email);

		if (!result) {
			const getUser = await this.userService.addUsers(req.body, password);
			this.ok(res, {
				token: { accesToken: getUser.accesToken, refreshToken: getUser.refreshToken },
				user: getUser.user,
			});
			return;
		} else {
			this.send(res, 401, 'This email is already in use, try sign-in!');
			return;
		}
	}
}
