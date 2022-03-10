import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

@Entity('users')
class User {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column()
  driver_license: string;

  @Column('boolean')
  is_admin: boolean;

  @CreateDateColumn()
  created_at;

  @Column()
  avatar: string | null;

  constructor() {
    if (!this.id) this.id = uuidV4();
  }
}

export { User };
