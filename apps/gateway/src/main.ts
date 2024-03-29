import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({ origin: ['http://localhost', 'https://steamcommunity.com'] });
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api');

  const port = configService.get('port');
  if (!port) throw new Error('Port not found in config');

  await app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
}
bootstrap();
