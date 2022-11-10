import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import { UserController } from './controllers/user.controller';
import 'reflect-metadata';
import { TYPES } from './types';
import cors from 'cors';

@injectable()
export class App {
	app: Express;
	port: number | string;
	server: Server;
	constructor(@inject(TYPES.UserController) private userController: UserController) {
		this.app = express();
		this.port = process.env.PORT || 4000;
	}

	useMidleWare() {
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
		//this.app.use(express.static(`${__dirname}\\assets`));
		this.app.use(cors());
	}

	useRouters() {
		this.app.use('/', this.userController.router);
	}

	public async init(): Promise<void> {
		this.useMidleWare();
		this.useRouters();
		this.server = this.app.listen(this.port, () => {
			console.log(`🚀 Server ready at http://localhost:${this.port}`);
		});
	}
}
