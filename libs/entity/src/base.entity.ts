import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

export class BaseEntity {
  @ApiProperty({
    description: 'The unique identifier of the entity.',
    example: 1,
  })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({
    description: 'The date the entity was created.',
    example: '2022-01-01T00:00:00Z',
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    description: 'The date the entity was last updated.',
    example: '2022-01-01T00:00:00Z',
  })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({
    description: 'The date the entity was deleted. used for soft deleting',
    example: '2022-01-01T00:00:00Z',
  })
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
