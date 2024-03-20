import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';

import { UserID } from '@ggcsgo/decorators';

import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TradeOfferEnum } from '@ggcsgo/types';
import { Item } from './entities/item.entity';

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

  @UseGuards(JwtAuthGuard)
  @Get()
  async buyItems(@UserID() userID: string, @Body() itemsIDs: string[]) {
    return this.inventoryService.buyItem(userID, itemsIDs);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async updateItem(@UserID() userID: string, @Body() items: Item[]) {
    return this.inventoryService.updateItem(userID, items);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/toggle-listing-privacy')
  async toggleListingPrivacy(@UserID() userID: string, @Param('id') id: string) {
    return this.inventoryService.toggleListingPrivacy(userID, id);
  }
}
