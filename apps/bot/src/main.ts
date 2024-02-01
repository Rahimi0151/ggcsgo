import { NestFactory } from '@nestjs/core';
import { BotModule } from './bot.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(BotModule);

  const configService = app.get(ConfigService);

  const port = configService.get('port');
  if (!port) throw new Error('Port not found in config');

  await app.listen(port, () => {
    console.log(`Bot listening on port ${port}`);
  });
}
bootstrap();
