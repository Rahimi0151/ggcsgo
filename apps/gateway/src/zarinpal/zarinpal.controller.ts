import { Controller, Post, Body, Res, Get, Query } from '@nestjs/common';

import { UserID } from '@ggcsgo/decorators';

import { Response } from 'express';

import { ZarinpalService } from './zarinpal.service';

@Controller('zarinpal')
export class ZarinpalController {
  constructor(private readonly zarinpalService: ZarinpalService) {}

  @Post('pay')
  async pay(
    @UserID() userID: number,
    @Body('amount') amount: number,
    @Body('description') description: string,
    @Res() res: Response,
  ) {
    const authority = await this.zarinpalService.pay(userID, amount, description);
    console.log(authority);
    res.redirect(`https://www.zarinpal.com/pg/StartPay/${authority}`);
    return authority;
  }

  @Get('go')
  async go(
    @Query('user_id') userID: number,
    @Query('amount') amount: number,
    @Query('description') description: string,
    @Res() res: Response,
  ) {
    const authority = await this.zarinpalService.pay(userID, amount, description);
    console.log(authority);
    res.redirect(`https://www.zarinpal.com/pg/StartPay/${authority}`);
    return authority;
  }

  @Get('verify')
  async verify(
    @Query('Authority') authority: string,
    @Query('Status') status: string,
    @Res() res: Response,
  ) {
    try {
      await this.zarinpalService.verify(authority, status);
      return res.redirect(`https://ggcsgo.rahimi0151.ir/payment?status=success`);
    } catch (error) {
      return res.redirect(`https://ggcsgo.rahimi0151.ir/payment?status=failed`);
    }
  }
}
