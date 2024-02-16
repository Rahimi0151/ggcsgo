import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { TradeOffer } from '../inventory/entities/trade-offers';

@Module({
  imports: [TypeOrmModule.forFeature([User, TradeOffer])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
