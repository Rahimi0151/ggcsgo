import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import {
  ShowInventoryRequest,
  ShowInventoryResponse,
  InventoryServiceController,
  INVENTORY_PACKAGE_NAME,
} from '@ggcsgo/proto';

import { Observable } from 'rxjs';

@Controller('inventory')
export class InventoryController implements InventoryServiceController {
  @GrpcMethod(INVENTORY_PACKAGE_NAME, 'getInventory')
  getInventory(
    request: ShowInventoryRequest,
  ): ShowInventoryResponse | Promise<ShowInventoryResponse> | Observable<ShowInventoryResponse> {
    console.log(request.steamID);

    const inventory = [
      { assetID: '123', marketHashName: 'AK-47 | Redline (Field-Tested)' },
      { assetID: '456', marketHashName: 'AWP | Dragon Lore (Factory New)' },
    ];

    return { inventory };
  }
}
