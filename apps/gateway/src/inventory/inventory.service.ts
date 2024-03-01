import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { TradeOfferEnum } from '@ggcsgo/types';
import { BOT, SHOW_INVENTORY, SELL_TO_USER, BUY_FROM_USER } from '@ggcsgo/rabbitmq';

import { lastValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import CEconItem from 'steamcommunity/classes/CEconItem';
import * as TradeOfferManager from 'steam-tradeoffer-manager';

import { Item } from './entities/item.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class InventoryService {
  constructor(
    @Inject(BOT) private botClient: ClientProxy,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Item) private itemRepository: Repository<Item>,
  ) {}

  async showInventory(steamID: string) {
    return lastValueFrom(this.botClient.send(SHOW_INVENTORY, steamID));
  }

  async sendTradeOffer(userID: string, itemsIDs: string[], type: TradeOfferEnum) {
    const user = await this.userRepository.findOne({ where: { steamId: userID } });
    if (!user) throw new Error('User not found');

    const trade =
      type === TradeOfferEnum.BUY
        ? await lastValueFrom(this.botClient.send(SELL_TO_USER, { userID, itemsIDs }))
        : await lastValueFrom(this.botClient.send(BUY_FROM_USER, { userID, itemsIDs }));

    if (!trade || trade.status === TradeOfferManager.ETradeOfferState.Declined)
      return { message: 'Trade request failed' };

    if (type === TradeOfferEnum.BUY) {
      trade.data.itemsToReceive.forEach(async (item: CEconItem) => {
        await this.itemRepository.update({ assetID: item.assetid.toString() }, { owner: null });
      });
    }

    if (type === TradeOfferEnum.SELL) {
      trade.data.itemsToReceive.forEach(async (item: CEconItem) => {
        await this.itemRepository.save({
          market_hash_name: item.market_hash_name,
          assetID: item.assetid.toString(),
          iconURL: (item as any).icon_url,
          owner: user,
        });
      });
    }
    return { message: 'Trade request sent', tradeID: trade };
  }
}
