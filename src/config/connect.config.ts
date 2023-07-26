import mongoose, { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';

export const connection = async () => {
	dotenv.config();
	const { DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER } = process.env;

	mongoose.set('strictQuery', false);
	try {
		await mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		} as ConnectOptions);
		console.log('DataBase_________________OK!');
	} catch (err) {
		console.log('Error connection', err);
	}
};
