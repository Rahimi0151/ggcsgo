import { Module } from '@nestjs/common';
import { BotController } from './bot.controller';
import { BotService } from './bot.service';
import { ConfigModule } from '@nestjs/config';
import { getBotConfig } from '@ggcsgo/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [getBotConfig],
    }),
  ],
  controllers: [BotController],
  providers: [BotService],
})
export class BotModule {}
