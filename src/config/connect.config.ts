import mongoose, { ConnectOptions } from 'mongoose';

export const connection = async () => {
	mongoose.set('strictQuery', false);
	try {
		await mongoose.connect('mongodb://localhost:27017/db', {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		} as ConnectOptions);
		console.log('DataBase_________________OK!');
	} catch (err) {
		console.log('Error connection', err);
	}
};
