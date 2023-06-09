import { AuthService } from './service/auth.service';
import { TokenServise } from './service/tokens.service';
import { App } from './main';
import { AuthController } from './controllers/auth.controller';
import { Container } from 'inversify';
import { connection } from './config/connect.config';
import { TYPES } from './types';

async function bootstrap() {
	const container = new Container();
	container.bind<App>(TYPES.App).to(App);
	container.bind<AuthController>(TYPES.AuthController).to(AuthController).inSingletonScope();
	container.bind<AuthService>(TYPES.AuthService).to(AuthService).inSingletonScope();
	container.bind<TokenServise>(TYPES.TokenServise).to(TokenServise).inSingletonScope();

	const app = container.get<App>(TYPES.App);
	await app.init();
	connection();
}
bootstrap();
