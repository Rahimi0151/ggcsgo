import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

import { TradeOfferEnum } from '@ggcsgo/types/types';
import { BUY_FROM_USER, SELL_TO_USER, SHOW_INVENTORY } from '@ggcsgo/rabbitmq/queues';

import { BotService } from './bot.service';

@Controller()
export class BotController {
  constructor(private readonly botService: BotService) {}

  @EventPattern(SHOW_INVENTORY)
  async handleEvent(@Payload() data: any) {
    return this.botService.showInventory(data);
  }

  @EventPattern(BUY_FROM_USER)
  async buyItemFromUser(@Payload() data: any) {
    return this.botService.sendTradeOffer(data, TradeOfferEnum.SELL);
  }

  @EventPattern(SELL_TO_USER)
  async sellItemToUser(@Payload() data: any) {
    return this.botService.sendTradeOffer(data, TradeOfferEnum.BUY);
  }
}
