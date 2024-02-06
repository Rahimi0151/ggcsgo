import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

import {
  INVENTORY_PACKAGE_NAME,
  INVENTORY_SERVICE_NAME,
  InventoryServiceClient,
} from '@ggcsgo/proto';

@Injectable()
export class InventoryService implements OnModuleInit {
  private inventoryService: InventoryServiceClient;
  constructor(@Inject(INVENTORY_PACKAGE_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    this.inventoryService = this.client.getService<InventoryServiceClient>(INVENTORY_SERVICE_NAME);
  }

  async getInventory() {
    return this.inventoryService.getInventory({ steamID: '123' });
  }
}
