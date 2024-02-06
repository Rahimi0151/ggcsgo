import { Module } from '@nestjs/common';
import { BotController } from './bot.controller';
import { BotService } from './bot.service';
import { ConfigModule } from '@nestjs/config';
import { getBotConfig } from '@ggcsgo/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database';
import { InventoryModule } from './inventory/inventory.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [getBotConfig],
    }),

    TypeOrmModule.forRootAsync(databaseConfig),

    InventoryModule,
  ],
  controllers: [BotController],
  providers: [BotService],
})
export class BotModule {}
