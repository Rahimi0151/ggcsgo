import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { getBotConfig } from '@ggcsgo/config';
import { BOT } from '@ggcsgo/rabbitmq/queues';
import { RmqModule, RmqService } from '@ggcsgo/rabbitmq';

import { BotService } from './bot.service';

import { BotController } from './bot.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [getBotConfig],
    }),
    RmqModule.register({ name: BOT }),
  ],
  controllers: [BotController],
  providers: [RmqService, BotService],
})
export class BotModule {}
