import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import { AuthController } from './controllers/auth.controller';
import 'reflect-metadata';
import { TYPES } from './types';
import cors from 'cors';

@injectable()
export class App {
	app: Express;
	port: number | string;
	server: Server;
	constructor(@inject(TYPES.AuthController) private authController: AuthController) {
		this.app = express();
		this.port = process.env.PORT || 4000;
	}

	useMidleWare() {
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(cors());
	}

	useRouters() {
		this.app.use('/auth', this.authController.router);
	}

	public async init(): Promise<void> {
		this.useMidleWare();
		this.useRouters();
		this.server = this.app.listen(this.port, () => {
			console.log(`🚀 Server ready at http://localhost:${this.port}`);
		});
	}
}
