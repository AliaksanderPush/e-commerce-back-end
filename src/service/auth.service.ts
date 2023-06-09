import { IUserResponseToClient, IUsers, UserRegister } from '../dto/user.dto';
import { UserModel } from '../models/user.model';
import { inject, injectable } from 'inversify';
import { hash, compare } from 'bcryptjs';
import { TokenServise } from './tokens.service';
import 'reflect-metadata';
import { TYPES } from '../types';
import { IJwtTokens, IRefreshToken } from '../dto/token.dto';
import { IRole } from '../dto/role.dto';
import { Role } from '../models/role.dto';

@injectable()
export class AuthService {
	constructor(@inject(TYPES.TokenServise) protected tokenServise: TokenServise) {}

	async searchByEmail(email: string): Promise<IUsers | null> {
		return await UserModel.findOne({ email });
	}

	async comparePassword(pass: string, hash: string): Promise<boolean> {
		return await compare(pass, hash);
	}

	async generateAndSaveTokens(id: string, email: string, role: string[]): Promise<IJwtTokens> {
		try {
			const tokens = this.tokenServise.generateTokens(email, id, role);
			await this.tokenServise.saveToken(id, tokens.refreshToken);
			return tokens;
		} catch (err) {
			return Promise.reject(err);
		}
	}

	async refresh(refreshToken: string): Promise<IRefreshToken | undefined> {
		const userData = this.tokenServise.validateRefreshToken(refreshToken);
		const tokenFromDb = await this.tokenServise.findToken(refreshToken);
		if (userData && tokenFromDb) {
			const { email } = userData;
			const user = await this.searchByEmail(email);
			if (user) {
				const tokens = await this.generateAndSaveTokens(user._id, user.email, user?.roles!);
				const result = { ...tokens, user };
				return result;
			}
		}
	}
	async addUsers(
		param: UserRegister,
		password: string,
	): Promise<IUserResponseToClient & IJwtTokens> {
		const { name, email } = param;

		const hashPass = await hash(password, 7);
		try {
			let userRole = await this.findRole('user');
			if (!userRole) {
				userRole = await Role.create({ value: 'user' });
			}

			const user = await UserModel.create({
				name,
				email,
				roles: [userRole.value],
				password: hashPass,
			});

			const tokens = await this.generateAndSaveTokens(user._id, email, user.roles as string[]);

			const result = { ...tokens, user };
			return result;
		} catch (err) {
			return Promise.reject(err);
		}
	}

	async findRole(val: string): Promise<IRole | null> {
		try {
			return await Role.findOne({ value: val });
		} catch (err) {
			return Promise.reject(err);
		}
	}
}
