import { NestFactory } from '@nestjs/core';

import { RmqService } from '@ggcsgo/rabbitmq';

import { BotModule } from './bot.module';
import { BOT } from '@ggcsgo/rabbitmq/queues';

async function bootstrap() {
  const app = await NestFactory.create(BotModule);

  const rmqService = app.get<RmqService>(RmqService);

  app.connectMicroservice(rmqService.getOptions(BOT, true));
  await app.startAllMicroservices();
}
bootstrap();
