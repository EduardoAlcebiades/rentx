import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

import { User } from './User';

@Entity('user_tokens')
class UserToken {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  refresh_token: string;

  @Column('uuid')
  user_id: string;

  @Column('timestamp')
  expires_date: Date;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  constructor() {
    if (!this.id) this.id = uuidV4();
  }
}

export { UserToken };
