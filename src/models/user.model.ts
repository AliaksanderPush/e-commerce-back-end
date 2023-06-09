import { model, Schema, Model, Types } from 'mongoose';
import { IUsers } from '../dto/user.dto';

const UserShema: Schema = new Schema<IUsers>({
	name: { type: String, required: true },
	password: { type: String, required: true },
	email: { type: String, unique: true, required: true },
	avatar: { type: String, required: false, default: '' },
	resetCode: { type: String, default: '' },
	roles: [{ type: String, ref: 'Role' }],
	created_at: { type: Date, default: Date.now },
});

export const UserModel: Model<IUsers> = model('UserModel', UserShema);
