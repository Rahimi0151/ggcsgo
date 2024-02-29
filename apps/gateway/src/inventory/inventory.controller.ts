import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { UserID } from '@ggcsgo/decorators';

import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async showInventory(@UserID() userID: string) {
    return await this.inventoryService.showInventory(userID);
  }

  @UseGuards(JwtAuthGuard)
  @Post('sell')
  async addInventory(@UserID() userID: string, @Body() itemsIDs: string[]) {
    return this.inventoryService.sendSellRequest(userID, itemsIDs);
  }
}
