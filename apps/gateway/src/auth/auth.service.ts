import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';

type SteamLoginOptions = {
  steamId: string;
  username: string;
  realName: string;
  profileURL: string;
  displayName: string;
  profilePhoto: string;
};
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  /**
   * Logs in a user via Steam.
   * @param userData - The data of the user to log in.
   * @returns A promise that resolves to a string representing the JWT token.
   */
  async LoginViaSteam(userData: SteamLoginOptions) {
    const user = await this.userService.findBySteamId(userData.steamId);
    if (user) {
      return this.createToken(user.steamId, user.username);
    } else {
      const newUser = await this.userService.create(userData);
      return this.createToken(newUser.steamId, newUser.username);
    }
  }

  /**
   * Creates a JWT token for the given email and username.
   * @param email - The email of the user.
   * @param username - The username of the user.
   * @returns A promise that resolves to a string representing the JWT token.
   */
  async createToken(steamId: string, steamUsername: string): Promise<string> {
    return this.jwtService.sign({ steamId, steamUsername });
  }

  /**
   * Validates a user's credentials.
   * @param payload - The user's credentials.
   * @returns A promise that resolves to the user if the credentials are valid.
   */
  async validateUser(payload: any) {
    return await this.userService.findBySteamId(payload.steamId);
  }
}
