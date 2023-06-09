import { Document } from 'mongoose';
import { IsEmail, Length, IsString, MinLength, MaxLength, Validate } from 'class-validator';
import { CustomPasswordValidate } from '../shared/validadion.rules';

export interface IUsers extends Document {
	name: string;
	password: string;
	resetCode: string;
	email: string;
	avatar: string;
	roles: string[];
	created_at: Date;
}

export class UserRegister {
	@MinLength(2, { message: 'Login must be at least 2 characters!' })
	@MaxLength(20, { message: 'Login must be less than 20 characters long!' })
	name: string;
	@IsEmail({}, { message: 'Email is failed!' })
	email: string;
	@IsString({ message: 'Enter you password!' })
	@Validate(CustomPasswordValidate, {
		message:
			'The password must contain characters, including letters, numbers, special characters, no spaces!',
	})
	password: string;
	@IsString({ message: 'Please confirm password!' })
	@Validate(CustomPasswordValidate, {
		message:
			'The password must contain characters, including letters, numbers, special characters, no spaces!',
	})
	confirmPassword: string;
	roles?: string[];
}

export class UserLogin {
	@IsEmail({}, { message: 'Email is failed!' })
	email: string;
	@IsString({ message: 'Enter you password!' })
	@Validate(CustomPasswordValidate, {
		message:
			'The password must contain characters, including letters, numbers, special characters, no spaces!',
	})
	password: string;
}

export interface IUserResponseToClient {
	user: IUsers & { _id: string };
}
