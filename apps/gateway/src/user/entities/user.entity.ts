import { ApiProperty } from '@nestjs/swagger';

import { BaseEntity } from '@ggcsgo/entities';

import { Entity, Column, OneToMany } from 'typeorm';

import { Item } from '../../inventory/entities/item.entity';
import { Payment } from '../../zarinpal/entities/payment.entity';
import { Recept } from '../../inventory/entities/recept.entity';

@Entity()
export class User extends BaseEntity {
  @ApiProperty({
    description: 'The Steam ID of the user.',
    example: '12345678901234567',
  })
  @Column({ name: 'steam_id' })
  steamId: string;

  @ApiProperty({
    description: 'The Steam username of the user.',
    example: 'john_doe_1337',
  })
  @Column()
  username: string;

  @ApiProperty({
    description: 'The Steam real name of the user.',
    example: 'John Doe',
  })
  @Column({ name: 'real_name' })
  realName: string;

  @ApiProperty({
    description: 'The Steam profile URL of the user.',
    example: 'https://steamcommunity.com/id/john_doe_1337/',
  })
  @Column({ name: 'profile_url' })
  profileURL: string;

  @ApiProperty({
    description: 'The Steam display name of the user.',
    example: 'John Doe',
  })
  @Column({ name: 'display_name' })
  displayName: string;

  @ApiProperty({
    description: 'The Steam profile photo of the user.',
    example:
      'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatar/12/12345678901234567_full.jpg',
  })
  @Column({ name: 'profile_photo' })
  profilePhoto: string;

  @OneToMany(() => Item, (item) => item.owner)
  items: Item[];

  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];

  @ApiProperty({
    description: 'The balance of the user.',
    example: 0,
  })
  @Column({ default: 0 })
  balance: number;

  @OneToMany(() => Recept, (recept) => recept.user)
  recepts: Recept[];
}
