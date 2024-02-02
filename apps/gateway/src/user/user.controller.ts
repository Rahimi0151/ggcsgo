import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserID } from '@ggcsgo/decorators';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  async getProfile(@UserID() userID: string) {
    return this.userService.getProfileBySteamID(userID);
  }
}
