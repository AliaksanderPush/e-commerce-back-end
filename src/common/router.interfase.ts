import { Response, Request, Router, NextFunction } from 'express';
import { IMiddleware } from '../middlewares/midleWare.interfase';

export interface IControllerRoute {
	path: string;
	func: (req: Request, res: Response, next: NextFunction) => void;
	methot: keyof Pick<Router, 'get' | 'post' | 'patch' | 'delete' | 'put'>;
	middlewares?: IMiddleware[];
}
