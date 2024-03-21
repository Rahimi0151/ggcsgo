import { v4 as uuid } from 'uuid';
import { Entity, Column, ManyToOne } from 'typeorm';

import { BaseEntity } from '@ggcsgo/entities';

import { Item } from './item.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Recept extends BaseEntity {
  @Column({ type: 'uuid', unique: true })
  transactionID: string;

  @ManyToOne(() => User, (user) => user.recepts)
  user: User;

  @ManyToOne(() => Item, (item) => item.recepts)
  item: Item;

  @Column({ type: 'int' })
  price: number;

  constructor() {
    super();
    this.transactionID = uuid();
  }
}
