import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { UserID } from '@ggcsgo/decorators';

import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TradeOfferEnum } from '@ggcsgo/types';

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
    return this.inventoryService.sendTradeOffer(userID, itemsIDs, TradeOfferEnum.SELL);
  }

  @UseGuards(JwtAuthGuard)
  @Post('buy')
  async buyInventory(@UserID() userID: string, @Body() itemsIDs: string[]) {
    return this.inventoryService.sendTradeOffer(userID, itemsIDs, TradeOfferEnum.BUY);
  }
}
