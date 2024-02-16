import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { CacheModule } from '@nestjs/cache-manager';

import { RmqModule, RmqService } from '@ggcsgo/rabbitmq';
import { getGatewayConfig } from '@ggcsgo/config';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { InventoryModule } from './inventory/inventory.module';

import { AppController } from './app.controller';

import { AppService } from './app.service';

import { redisConfig } from './config/redis';
import { databaseConfig } from './config/database';
import { BOT } from '@ggcsgo/rabbitmq/queues';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [getGatewayConfig],
    }),

    PassportModule.register({ defaultStrategy: 'steam' }),

    TypeOrmModule.forRootAsync(databaseConfig),

    CacheModule.registerAsync(redisConfig),

    AuthModule,

    UserModule,

    InventoryModule,

    RmqModule.register({ name: BOT }),
  ],
  controllers: [AppController],
  providers: [AppService, RmqService],
})
export class AppModule {}
