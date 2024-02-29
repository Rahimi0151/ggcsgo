import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

import { BOT, BUY_FROM_USER, SELL_TO_USER, SHOW_INVENTORY } from '@ggcsgo/rabbitmq/queues';

import { lastValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { TradeOffer } from './entities/trade-offers';
import CEconItem from 'steamcommunity/classes/CEconItem';
import * as TradeOfferManager from 'steam-tradeoffer-manager';

import { Item } from './entities/item.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class InventoryService {
  constructor(
    @Inject(BOT) private botClient: ClientProxy,
    @Inject(CACHE_MANAGER) private redis: Cache,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Item) private itemRepository: Repository<Item>,
    @InjectRepository(TradeOffer) private tradeOfferRepository: Repository<TradeOffer>,
  ) {}

  async showInventory(steamID: string) {
    return lastValueFrom(this.botClient.send(SHOW_INVENTORY, steamID));
  }

  async sendSellRequest(userID: string, itemsIDs) {
    const user = await this.userRepository.findOne({ where: { steamId: userID } });
    if (!user) throw new Error('User not found');

    const trade = await lastValueFrom(this.botClient.send(BUY_FROM_USER, { userID, itemsIDs }));

    if (!trade) return { message: 'Trade request failed' };

    if (trade.status === TradeOfferManager.ETradeOfferState.Accepted) console.log('a', trade);

    if (trade.status === TradeOfferManager.ETradeOfferState.Declined) {
      trade.data.itemsToReceive.forEach(async (item: CEconItem) => {
        await this.itemRepository.save({
          market_hash_name: item.market_hash_name,
          assetID: item.assetid.toString(),
          iconURL: (item as any).icon_url,
          owner: user,
        });
      });
    }

    // await this.tradeOfferRepository.save({
    //   user,
    //   tradeID,
    //   items: itemsIDs,
    //   status: TradeOfferStatusEnum.PENDING,
    // });

    return { message: 'Trade request sent', tradeID: trade };
  }

  async sendBuyRequest(userID: string, itemsIDs) {
    const user = await this.userRepository.findOne({ where: { steamId: userID } });
    if (!user) throw new Error('User not found');

    const trade = await lastValueFrom(this.botClient.send(SELL_TO_USER, { userID, itemsIDs }));

    if (!trade) return { message: 'Trade request failed' };

    if (trade.status === TradeOfferManager.ETradeOfferState.Accepted) console.log('a', trade);

    if (trade.status === TradeOfferManager.ETradeOfferState.Declined) {
      trade.data.itemsToReceive.forEach(async (item: CEconItem) => {
        await this.itemRepository.save({
          market_hash_name: item.market_hash_name,
          assetID: item.assetid.toString(),
          iconURL: (item as any).icon_url,
          owner: user,
        });
      });
    }

    // await this.tradeOfferRepository.save({
    //   user,
    //   tradeID,
    //   items: itemsIDs,
    //   status: TradeOfferStatusEnum.PENDING,
    // });

    return { message: 'Trade request sent', tradeID: trade };
  }
}
