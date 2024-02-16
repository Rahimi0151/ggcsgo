import { BaseEntity } from '@ggcsgo/entities';

import { Entity, Column, ManyToOne } from 'typeorm';

import { User } from '../../user/entities/user.entity';

export enum TradeOfferStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
}

@Entity()
export class TradeOffer extends BaseEntity {
  @Column()
  tradeID: string;

  @Column('text', { array: true })
  items: string[];

  @Column({ type: 'enum', enum: TradeOfferStatus, default: TradeOfferStatus.PENDING })
  status: TradeOfferStatus;

  @ManyToOne(() => User, (user) => user.tradeOffers)
  user: User;
}
