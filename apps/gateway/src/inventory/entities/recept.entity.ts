import { v4 as uuid } from 'uuid';
import { BaseEntity, Entity, Column, ManyToOne } from 'typeorm';

import { Item } from './item.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Recept extends BaseEntity {
  @Column({ type: 'uuid', unique: true, default: () => 'uuid_generate_v4()' })
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
