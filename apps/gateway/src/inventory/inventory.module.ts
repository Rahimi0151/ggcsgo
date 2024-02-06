import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { INVENTORY_PACKAGE_NAME } from '@ggcsgo/proto';

import { join } from 'path';

import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: INVENTORY_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: INVENTORY_PACKAGE_NAME,
          protoPath: join(__dirname, '../../../libs/proto/inventory.proto'),
        },
      },
    ]),
  ],
  providers: [InventoryService],
  controllers: [InventoryController],
})
export class InventoryModule {}
