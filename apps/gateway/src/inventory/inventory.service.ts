import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

import { BOT, BUY_ITEM_FROM_USER, SHOW_INVENTORY } from '@ggcsgo/rabbitmq/queues';

import { lastValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';

import { User } from '../user/entities/user.entity';
import { TradeOffer, TradeOfferStatus as TradeOfferStatusEnum } from './entities/trade-offers';
import { RmqService } from '@ggcsgo/rabbitmq';

@Injectable()
export class InventoryService {
  constructor(
    @Inject(BOT) private botClient: ClientProxy,
    @Inject(CACHE_MANAGER) private redis: Cache,
    @InjectRepository(TradeOffer) private tradeOfferRepository: Repository<TradeOffer>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly rmqService: RmqService,
  ) {}

  async showInventory(steamID: string) {
    return lastValueFrom(this.botClient.send(SHOW_INVENTORY, { steamID }));
  }

  async sendSellRequest(userID: string, itemsIDs) {
    const user = await this.userRepository.findOne({ where: { steamId: userID } });
    if (!user) throw new Error('User not found');

    const tradeID = await lastValueFrom(
      this.botClient.send(BUY_ITEM_FROM_USER, { userID, itemsIDs }),
    );
    if (tradeID) {
      const pendingTrades = ((await this.redis.get('pendingTrades')) as []) || [];
      const newTrade = { userID, itemsIDs, tradeID, type: 'RECEIVE_ITEM' };
      await this.redis.set('pendingTrades', [...pendingTrades, newTrade]);

      await this.tradeOfferRepository.save({
        user,
        tradeID,
        items: itemsIDs.items,
        status: TradeOfferStatusEnum.PENDING,
      });

      return { message: 'Trade request sent', tradeID };
    }
  }

  async updatePendingTrades(doneTradeID: string) {
    console.log('updatePendingTrades', doneTradeID);
  }
}
