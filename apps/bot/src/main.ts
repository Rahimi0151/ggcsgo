import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { INVENTORY_PACKAGE_NAME } from '@ggcsgo/proto';

import { join } from 'path';

import { BotModule } from './bot.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(BotModule, {
    transport: Transport.GRPC,
    options: {
      protoPath: join(__dirname, './../../../libs/proto/inventory.proto'),
      package: INVENTORY_PACKAGE_NAME,
    },
  });

  await app.listen();
}
bootstrap();
