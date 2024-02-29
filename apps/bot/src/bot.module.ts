import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { BOT } from '@ggcsgo/rabbitmq';
import { getBotConfig } from '@ggcsgo/config';

import { BotService } from './bot.service';

import { BotController } from './bot.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [getBotConfig],
    }),

    ClientsModule.registerAsync([
      {
        name: BOT,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('rabbitmq.URI')],
            queue: BOT,
            queueOptions: { durable: false },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [BotController],
  providers: [BotService],
})
export class BotModule {}
