import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { Inject, Injectable } from '@nestjs/common';

import { BOT, TRADE_OFFER_CHANGED } from '@ggcsgo/rabbitmq/queues';
import { Cases, caseNames } from '@ggcsgo/types/types';

import * as fs from 'fs';
import * as SteamUser from 'steam-user';
import { generateAuthCode } from 'steam-totp';
import * as SteamCommunity from 'steamcommunity';
import CEconItem from 'steamcommunity/classes/CEconItem';
import * as TradeOfferManager from 'steam-tradeoffer-manager';

@Injectable()
export class BotService {
  private static instance: BotService;
  public steamUser: SteamUser;
  public community: SteamCommunity;
  public tradeOfferManager: TradeOfferManager;

  constructor(
    private configService: ConfigService,
    @Inject(BOT) private botClient: ClientProxy,
  ) {
    if (!this.configService.get('steam.active')) return;

    this.steamUser = new SteamUser();
    this.community = new SteamCommunity();

    this.tradeOfferManager = new TradeOfferManager({
      steam: this.steamUser,
      community: this.community,
      language: 'en',
      pollInterval: 10000,
    });

    const savedSession = this.loadSession();
    if (!savedSession) this.loginToSteam();
    else {
      this.community.setCookies(savedSession);
      this.tradeOfferManager.setCookies(savedSession);
    }

    this.tradeOfferManager.on('sentOfferChanged', (offer) => {
      this.botClient.send(TRADE_OFFER_CHANGED, offer);
    });
  }

  /**
   * Logs into Steam.
   *
   * used when there is no saved session in session.json
   */
  private loginToSteam() {
    this.steamUser.logOn({
      accountName: this.configService.get('steam.accountName'),
      password: this.configService.get('steam.accountPassword'),
      twoFactorCode: generateAuthCode(this.configService.get('steam.sharedSecret')),
    });

    this.steamUser.on('loggedOn', () => {
      console.log('Logged into Steam');
    });

    this.steamUser.on('webSession', (sessionid, cookies) => {
      this.tradeOfferManager.setCookies(cookies);
      this.community.setCookies(cookies);
      this.community.startConfirmationChecker(
        20000,
        this.configService.get('steam.identitySecret'),
      );
      this.saveSession(cookies);
    });
  }

  /**
   * TODO: Add description
   * Sends trade offer to user.
   * @param data - data to send trade offer
   * @param data.userID - user steamID
   * @param data.itemsIDs - items to send to user
   * @param data.itemsIDs.items - array of items to send to user
   * @param data.itemsIDs.items[].assetid - assetid of the item
   * @returns void
   *
   */
  buyItemFromUser(data: any) {
    return new Promise((resolve, reject) => {
      const offer = this.tradeOfferManager.createOffer(data.userID);

      this.tradeOfferManager.getUserInventoryContents(
        data.userID,
        730,
        2,
        true,
        (err, inventory) => {
          if (err) console.log(err);

          for (const item of inventory) {
            if (data.itemsIDs.items.includes(item.assetid) && item.tradable) {
              offer.addTheirItem(item);
            }
          }

          offer.setMessage('Trade offer from ggcsgo.com');

          offer.send((err, status) => {
            if (err) return console.log(err);
            if (status === 'pending') return console.log('Trade offer sent');
          });
        },
      );
      setTimeout(() => {
        if (offer.id) resolve(offer.id);
        else reject('Error sending trade offer');
      }, 2000);
    });
  }

  /**
   * TODO: Add description
   * Gets user inventory.
   * @param steamID - user steamID
   * @returns Promise<any[]>
   * @returns Promise<any[]>.then - array of user inventory
   * @returns Promise<any[]>.catch - error
   * @returns Promise<any[]>.catch.err - error
   */
  async showInventory(steamID: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.tradeOfferManager.getUserInventoryContents(steamID, 730, 2, true, (err, inventory) => {
        if (err) reject(err);

        resolve(this.filterInventory(inventory));
      });
    });
  }

  filterInventory(inventory: CEconItem[]) {
    const userInventory = [];

    for (const item of inventory) {
      if (!caseNames.includes(item.market_hash_name as Cases)) continue;

      userInventory.push({
        assetid: item.id,
        market_hash_name: item.market_hash_name,
        type: 'case',
        icon_url: item.getImageURL(),
      });
    }

    return userInventory;
  }

  /**
   * Loads session from file.
   *
   * load session from file when the bot is restarted. makes us not hit the rate limit of steam.
   *
   * ! DO NOT USE THIS METHOD IN PRODUCTION, IT WILL WRITE THE SESSION TO FILE AS PLAIN TEXT
   */
  private loadSession(): string[] | null {
    try {
      const data = fs.readFileSync('session.json', 'utf8');
      return JSON.parse(data);
    } catch (err) {
      console.error('Error reading session from file');
      return null;
    }
  }

  /**
   * Saves session to file.
   *
   * saves session to file when the bot is restarted. makes us not hit the rate limit of steam.
   *
   * ! DO NOT USE THIS METHOD IN PRODUCTION, IT WILL WRITE THE SESSION TO FILE AS PLAIN TEXT
   */
  private saveSession(cookies: string[]): void {
    try {
      fs.writeFileSync('session.json', JSON.stringify(cookies));
    } catch (err) {
      console.error('Error writing session to file:', err);
    }
  }
}
