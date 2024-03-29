import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { Strategy } from 'passport-steam';

import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SteamStrategy extends PassportStrategy(Strategy, 'steam') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      returnURL: 'https://ggcsgo.rahimi0151.ir/api/auth/steam-return',
      realm: 'https://ggcsgo.rahimi0151.ir/',
      apiKey: configService.get<string>('steam.apiKey'),
    });
  }

  async validate(identifier: string, profile: any) {
    const jwt = await this.authService.LoginViaSteam({
      steamId: profile.id,
      username: profile._json.profileurl.match(/\/id\/(.*)\//)[1],
      realName: profile._json.realname,
      profileURL: profile._json.profileurl,
      displayName: profile.displayName,
      profilePhoto: profile.photos[2].value,
    });

    return { jwt };
  }
}
