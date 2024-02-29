import { ApiProperty } from '@nestjs/swagger';

import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import { BaseEntity } from '@ggcsgo/entities';
import { User } from '../../user/entities/user.entity';

const sevenDaysInFuture = new Date();
sevenDaysInFuture.setDate(sevenDaysInFuture.getDate() + 7);

@Entity()
export class Item extends BaseEntity {
  @ApiProperty({
    description: 'The type of the item',
    example: 'Rifle',
  })
  @Column({ nullable: true })
  type: string;

  @ApiProperty({
    description: 'The weapon type of the item',
    example: 'AK-47',
  })
  @Column({ name: 'weapon', nullable: true })
  weapon: string;

  @ApiProperty({
    description: 'The name of the actual skin',
    example: 'Safari Mesh',
  })
  @Column({ nullable: true })
  name: string;

  @ApiProperty({
    description: 'The wear level of the item',
    example: 'Minimal Wear',
  })
  @Column({ name: 'wear_level', nullable: true })
  wearLevel: string;

  @ApiProperty({
    description: 'The class id of the item',
    example: '5675684751',
  })
  @Column({ name: 'class_id', nullable: true })
  classID: string;

  @ApiProperty({
    description: 'The instance id of the item',
    example: '302028390',
  })
  @Column({ name: 'instance_id', nullable: true })
  instanceID: string;

  @ApiProperty({
    description: 'The asset id of the item',
    example: '12448519881398331223',
  })
  @Column({ name: 'asset_id', nullable: true })
  assetID: string;

  @ApiProperty({
    description: 'The market hash name of the item',
    example: 'AK-47 | Safari Mesh (Minimal Wear)',
  })
  @Column({ name: 'market_name', nullable: true })
  market_hash_name: string;

  @ApiProperty({
    description: 'The icon URL of the item',
    example:
      'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhzw8zFdC5K08i3mr-HnvD8J_WBxTwD6ZB12b7Hodumig23rUY5YTymJ4TBcFA7NVvW-FW5l-zr1JXtot2XnkNBBWuK',
  })
  @Column({ name: 'icon_url', nullable: true })
  iconURL: string;

  @ApiProperty({
    description: 'The large icon URL of the item',
    example:
      'https://steamcommunity-a.akamaihd.net/economy/image/-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXH5ApeO4YmlhxYQknCRvCo04DEVlxkKgpot7HxfDhzw8zFdC5K08i3mr-HnvD8J4Tdl3lW7Ysh2b6T9Nnx2wOy_0RvMWCgcoPAcFNrYlqE-Ae7le3ph5K76p_NmHEypGB8sh8bMz38',
  })
  @Column({ name: 'icon_url_large', nullable: true })
  iconUrlLarge: string;

  @ApiProperty({
    description: 'The inspect link of the item',
    example:
      'steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S%owner_steamid%A%assetid%D12448519881398331223',
  })
  @Column({ name: 'inspect_link', nullable: true })
  inspectLink: string;

  @ApiProperty({
    description: 'The collection of the item',
    example: 'The Dust 2 Collection',
  })
  @Column({ nullable: true })
  collection: string;

  @ApiProperty({
    description: 'The trade ban date of the item',
    example: '2021-03-25T18:00:00.000Z',
  })
  @Column({ nullable: true, default: sevenDaysInFuture })
  tradeBanDate: Date;

  @ApiProperty({
    description: 'The quality of the item',
    example: 'Industrial Grade',
  })
  @Column({ nullable: true })
  quality: string;

  @ApiProperty({ description: 'The stat track of the item', example: false })
  @Column({ name: 'stat_trak', nullable: true })
  statTrak: boolean;

  @ManyToOne(() => User, (user) => user.items)
  @JoinColumn({ name: 'owner_id' })
  owner: User;
}
