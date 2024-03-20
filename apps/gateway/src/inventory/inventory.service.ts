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
import { Recept } from './entities/recept.entity';

@Injectable()
export class InventoryService {
  constructor(
    @Inject(BOT) private botClient: ClientProxy,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Item) private itemRepository: Repository<Item>,
    @InjectRepository(Recept) private receptRepository: Repository<Recept>,
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

  /**
   * This method is used to buy items from the marketplace
   * @param userID - The user's steamID
   * @param itemsIDs - The items to buy
   */
  async buyItem(userID: string, itemsIDs: string[]) {
    try {
      await this.itemRepository.manager.transaction(async (transactionalEntityManager) => {
        const buyer = await transactionalEntityManager.findOne(User, {
          where: { steamId: userID },
        });

        for (const itemID of itemsIDs) {
          const item = await transactionalEntityManager.findOne(Item, { where: { id: +itemID } });

          // any error will rollback the transaction automatically
          if (!item.listed) throw new Error('Item is not listed for sale');
          if (buyer.balance < item.price) throw new Error('Not enough balance');

          item.owner.balance += item.price;
          buyer.balance -= item.price;
          item.owner = buyer;

          const recept = this.receptRepository.create({ user: buyer, item, price: item.price });
          await transactionalEntityManager.save(recept);

          await transactionalEntityManager.save(item);
        }

        await transactionalEntityManager.save(buyer);
      });
    } catch (e) {
      return (e as Error).message;
    }
  }

  /**
   * This method is used to toggle the privacy of a listing
   * @param userID - The user's steamID
   * @param itemID - The item to update
   * @returns - A message indicating the status of the operation
   * @throws - An error if the item is not found or the user is not the owner
   */
  async toggleListingPrivacy(userID: string, itemID: string) {
    const item = await this.itemRepository.findOne({
      where: { id: +itemID },
      relations: ['owner'],
    });

    if (!item) throw new Error('Item not found');
    if (item.owner.steamId !== userID) throw new Error('You are not the owner of this item');

    item.listed = !item.listed;
    await this.itemRepository.save(item);

    return { message: 'Item updated' };
  }

  async updateItem(userID: string, items: Item[]) {
    items.forEach(async (item: Item) => {
      await this.itemRepository.update({ id: item.id }, { ...item });
    });
  }
}
