import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { BOT } from '@ggcsgo/rabbitmq';

import { Item } from './entities/item.entity';
import { Recept } from './entities/recept.entity';
import { User } from '../user/entities/user.entity';

import { InventoryService } from './inventory.service';

import { InventoryController } from './inventory.controller';

@Module({
  imports: [
    ConfigModule,

    TypeOrmModule.forFeature([User, Item, Recept]),

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
  controllers: [InventoryController],
  providers: [InventoryService],
})
export class InventoryModule {}
