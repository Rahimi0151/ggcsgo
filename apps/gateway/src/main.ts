import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const port = configService.get('port');
  if (!port) throw new Error('Port not found in config');

  await app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
}
bootstrap();
