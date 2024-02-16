import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

import { RmqService } from '@ggcsgo/rabbitmq';
import { BUY_ITEM_FROM_USER, SHOW_INVENTORY } from '@ggcsgo/rabbitmq/queues';

import { BotService } from './bot.service';

@Controller()
export class BotController {
  constructor(
    private readonly botService: BotService,
    private readonly rmqService: RmqService,
  ) {}

  @EventPattern(SHOW_INVENTORY)
  async handleEvent(@Payload() data: any) {
    return this.botService.showInventory(data);
  }

  @EventPattern(BUY_ITEM_FROM_USER)
  async buyItemFromUser(@Payload() data: any) {
    return this.botService.buyItemFromUser(data);
  }
}
