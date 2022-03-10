import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

import { User } from '../../../../accounts/infra/typeorm/entities/User';
import { Car } from '../../../../cars/infra/typeorm/entities/Car';

@Entity('rentals')
class Rental {
  @PrimaryColumn('uuid')
  id: string;

  @Column('timestamp')
  start_date: Date;

  @Column('timestamp')
  end_date: Date | null;

  @Column('timestamp')
  expected_return_date: Date;

  @Column('numeric')
  total: number | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column('uuid')
  car_id: string;

  @Column('uuid')
  user_id: string;

  @ManyToOne(() => Car)
  @JoinColumn({ name: 'car_id' })
  car: Car;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  constructor() {
    if (!this.id) this.id = uuidV4();
  }
}

export { Rental };
