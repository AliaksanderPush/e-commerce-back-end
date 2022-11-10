import { IUsers } from './../dto/user.dto';
import { UserModel } from '../models/user.model';
import { inject, injectable } from 'inversify';
import { hash, compare } from 'bcryptjs';
import { TokenServise } from './tokens.service';
import 'reflect-metadata';
import { TYPES } from '../types';
import { IJwtTokens, IRefreshToken, IToken } from '../dto/token.dto';
import { JwtPayload, verify } from 'jsonwebtoken';
import { IUserPayload } from '../dto/userPayload.dto';

@injectable()
export class UserService {
	constructor(@inject(TYPES.TokenServise) protected tokenServise: TokenServise) {}
	async getAll() {
		try {
			return await UserModel.find();
		} catch (err) {
			return Promise.reject(err);
		}
	}

	async putUser(userId: string, data: IUsers): Promise<IUsers | null> {
		try {
			return await UserModel.findByIdAndUpdate(userId, data, { returnDocument: 'after' });
		} catch (err) {
			return Promise.reject(err);
		}
	}

	async deleteUser(id: string) {
		try {
			await UserModel.findByIdAndDelete(id);
		} catch (err) {
			return Promise.reject(err);
		}
	}

	async getUser(id: string) {
		try {
			return await UserModel.findById(id);
		} catch (err) {
			return Promise.reject(err);
		}
	}

	async searchByEmail(email: string): Promise<IUsers | null> {
		return await UserModel.findOne({ email });
	}

	async comparePassword(pass: string, hash: string): Promise<boolean> {
		return await compare(pass, hash);
	}

	async generateAndSaveTokens(id: string, email: string, role: string[]): Promise<IJwtTokens> {
		try {
			const tokens = this.tokenServise.generateTokens(email, role as string[], id);
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
}
