import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

import { Repository } from 'typeorm';

import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Finds a user by their steamId.
   * @param steamId The steamId of the user to find.
   * @returns A Promise that resolves to the found user.
   */
  async findBySteamId(steamId: string): Promise<User> {
    return this.userRepository.findOne({ where: { steamId } });
  }

  /**
   * Creates a new user.
   * @param userData The data of the user to create.
   * @returns A Promise that resolves to the created user.
   */
  async create(userData: Partial<User>): Promise<User> {
    return this.userRepository.save(userData);
  }
}
