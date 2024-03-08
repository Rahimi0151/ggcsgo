import { ApiProperty } from '@nestjs/swagger';

import { BaseEntity } from '@ggcsgo/entities';

import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import { User } from '../../user/entities/user.entity';

@Entity()
export class Payment extends BaseEntity {
  @ApiProperty({
    description: 'the amount of the transaction in IRT',
  })
  @Column()
  amount: number;

  @ApiProperty({
    description: 'a description for the transaction',
  })
  @Column()
  description: string;

  @ApiProperty({
    description: 'a unique identifier by Zarinpal for this exact transaction',
  })
  @Column({ name: 'authority', nullable: false })
  authority: string;

  @ApiProperty({
    description: 'whether the transaction was approved by Zarinpal',
  })
  @Column({ name: 'is_approved', default: false })
  isApproved: boolean;

  @ManyToOne(() => User, (user) => user.payments)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({
    description: 'the fee that Zarinpal takes from the amount',
  })
  @Column()
  fee: number;
}
