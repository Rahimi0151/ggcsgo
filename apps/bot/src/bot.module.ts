import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { RmqModule, RmqService } from '@ggcsgo/rabbitmq';
import { getBotConfig } from '@ggcsgo/config';

import { BotController } from './bot.controller';
import { BOT } from '@ggcsgo/rabbitmq/queues';
import { BotService } from './bot.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [getBotConfig],
    }),

    RmqModule.register({
      name: BOT,
    }),
  ],
  controllers: [BotController],
  providers: [RmqService, BotService],
})
export class BotModule {}
