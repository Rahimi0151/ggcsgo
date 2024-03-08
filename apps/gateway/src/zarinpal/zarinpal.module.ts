import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../user/entities/user.entity';
import { Payment } from './entities/payment.entity';

import { ZarinpalService } from './zarinpal.service';

import { ZarinpalController } from './zarinpal.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([User, Payment])],
  providers: [ZarinpalService],
  controllers: [ZarinpalController],
})
export class ZarinpalModule {}
