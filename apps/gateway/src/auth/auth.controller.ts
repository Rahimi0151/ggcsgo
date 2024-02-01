import { AuthGuard } from '@nestjs/passport';
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Response } from 'express';

import { AuthService } from './auth.service';
import { RequestWithJWT } from './strategies/jwt.strategy';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('steam')
  @UseGuards(AuthGuard('steam'))
  @ApiOperation({ summary: 'Authenticate with Steam' })
  steamAuth() {}

  @Get('steam-return')
  @UseGuards(AuthGuard('steam'))
  @ApiOperation({
    summary: 'Handle Steam authentication redirect, there will be a query parameter with the JWT',
  })
  @ApiBearerAuth()
  steamAuthRedirect(@Req() req: RequestWithJWT, @Res({ passthrough: true }) res: Response) {
    res.cookie('jwt', req.user.jwt, { httpOnly: true });
    res.redirect(`http://localhost:3000/`);
  }
}
