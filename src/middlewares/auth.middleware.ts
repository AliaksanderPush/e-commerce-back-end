import { IMiddleware } from './middleWare.interfase';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { IUserPayload } from '../dto/userPayload.dto';

export class AuthMiddleWare implements IMiddleware {
	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.headers.authorization) {
			try {
				const token = req.headers.authorization.split(' ')[1];
				const decData = verify(token, process.env.SECRET as string) as IUserPayload;
				const { email, role, _id } = decData;
				req.user = { email, role, _id };
				next();
			} catch (err) {
				res.status(403).json('User is not authorized!');
			}
		} else {
			next();
		}
	}
}
