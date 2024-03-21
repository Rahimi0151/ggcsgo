import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { BOT } from '@ggcsgo/rabbitmq';

import { BotModule } from './bot.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(BotModule);

  const rabbitMqURI = app.get(ConfigService).get<string>('rabbitmq.URI');

  const service = await NestFactory.createMicroservice<MicroserviceOptions>(BotModule, {
    transport: Transport.RMQ,
    options: {
      urls: [rabbitMqURI],
      queue: BOT,
      queueOptions: { durable: false },
    },
  });

  await service.listen();
}
bootstrap();
