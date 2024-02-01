import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { getGatewayConfig } from '@ggcsgo/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [getGatewayConfig],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
