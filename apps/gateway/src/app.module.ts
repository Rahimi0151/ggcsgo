import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { getGatewayConfig } from '@ggcsgo/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [getGatewayConfig],
    }),

    TypeOrmModule.forRootAsync(databaseConfig),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
