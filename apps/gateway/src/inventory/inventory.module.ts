import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RmqModule } from '@ggcsgo/rabbitmq';
import { BOT } from '@ggcsgo/rabbitmq/queues';

import { User } from '../user/entities/user.entity';
import { TradeOffer } from './entities/trade-offers';

import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { Item } from './entities/item.entity';

@Module({
  imports: [
    RmqModule.register({
      name: BOT,
    }),

    TypeOrmModule.forFeature([User, TradeOffer, Item]),
  ],
  providers: [InventoryService],
  controllers: [InventoryController],
})
export class InventoryModule {}
