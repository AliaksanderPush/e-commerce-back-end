import { UserService } from './service/user.service';
import { TokenServise } from './service/tokens.service';
import { App } from './main';
import { UserController } from './controllers/user.controller';
import { Container } from 'inversify';
import { TYPES } from './types';

async function bootstrap() {
	const container = new Container();
	container.bind<App>(TYPES.App).to(App);
	container.bind<UserController>(TYPES.UserController).to(UserController).inSingletonScope();
	container.bind<UserService>(TYPES.UserService).to(UserService).inSingletonScope();
	container.bind<TokenServise>(TYPES.TokenServise).to(TokenServise).inSingletonScope();

	const app = container.get<App>(TYPES.App);
	await app.init();
	//connection();
}
bootstrap();
