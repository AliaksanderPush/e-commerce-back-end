import { injectable } from 'inversify';
import { sign, verify } from 'jsonwebtoken';
import 'reflect-metadata';
import { IJwtTokens } from '../dto/token.dto';
import { IUserPayload } from '../dto/userPayload.dto';
import { TokenModel } from '../models/tokens.model';
import dotenv from 'dotenv';
dotenv.config();

@injectable()
export class TokenServise {
	generateTokens(email: string, id: string, role: string[]): IJwtTokens {
		const payLoad = {
			email,
			role,
			_id: id,
		};

		const accesToken = sign(payLoad, process.env.SECRET!, {
			expiresIn: '1h',
		});
		const refreshToken = sign(payLoad, process.env.SECRET!, {
			expiresIn: '15d',
		});
		return {
			accesToken,
			refreshToken,
		};
	}

	validateAccessToken(token: string) {
		try {
			const userData = verify(token, process.env.SECRET!) as IUserPayload;
			return userData;
		} catch (e) {
			return null;
		}
	}

	validateRefreshToken(token: string) {
		try {
			const userData = verify(token, process.env.SECRET!) as IUserPayload;
			return userData;
		} catch (e) {
			return null;
		}
	}

	async saveToken(userId: string, refreshToken: string) {
		const tokenData = await TokenModel.findOne({ user: userId });
		if (tokenData) {
			tokenData.refreshToken = refreshToken;
			return tokenData.save();
		}
		const token = await TokenModel.create({
			user: userId,
			refreshToken,
		});
		return token;
	}

	async removeToken(refreshToken: string) {
		const tokenData = await TokenModel.deleteOne({ refreshToken });
		return tokenData;
	}

	async findToken(refreshToken: string) {
		const tokenData = await TokenModel.findOne({ refreshToken });
		return tokenData;
	}
}
