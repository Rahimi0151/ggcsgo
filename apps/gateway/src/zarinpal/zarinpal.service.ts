import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import axios from 'axios';
import { Repository } from 'typeorm';

import { User } from '../user/entities/user.entity';
import { Payment } from './entities/payment.entity';

@Injectable()
export class ZarinpalService {
  constructor(
    private configService: ConfigService,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async pay(userID: number, amount: number, description: string = 'ali') {
    const user = await this.userRepository.findOneBy({ id: userID });

    const merchant_id = this.configService.get('zarinpal.merchantID');
    const callback_url = 'https://ggcsgo.rahimi0151.ir/api/zarinpal/verify';
    const body = { merchant_id, amount, callback_url, description };

    const url = 'https://api.zarinpal.com/pg/v4/payment/request.json';
    try {
      const response = await axios.post(url, body);

      const { data } = response.data;

      if (data.code === -1) throw new BadRequestException('payment failed');

      const payment = this.paymentRepository.create({
        user,
        amount,
        description,
        fee: data.fee,
        authority: data.authority,
      });

      await this.paymentRepository.save(payment);

      return data.authority;
    } catch (error) {
      console.log(error.response.data);
    }
  }

  async verify(authority: string, status: string) {
    if (status !== 'OK') throw new BadRequestException('payment failed');

    const payment = await this.paymentRepository.findOneBy({ authority });
    if (!payment) throw new NotFoundException('Payment not found');

    const url = 'https://api.zarinpal.com/pg/v4/payment/verify.json';
    const merchant_id = process.env.ZARINPAL_MERCHANT_ID;
    await axios.post(url, { authority, amount: payment.amount, merchant_id }); //will throw error if not verified automatically

    payment.isApproved = true;
    await this.paymentRepository.save(payment);
  }
}
