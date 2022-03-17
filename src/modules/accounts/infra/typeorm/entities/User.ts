import { Expose } from 'class-transformer';
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

  @Expose()
  avatar_url(): string {
    switch (process.env.DISK) {
      case 'local':
        return `http://${process.env.APP_HOST}:${process.env.APP_PORT}/avatar/${this.avatar}`;
      case 's3':
        return `${process.env.AWS_BUCKET_URL}/avatar/${this.avatar}`;
      default:
        return null;
    }
  }

  constructor() {
    if (!this.id) this.id = uuidV4();
  }
}

export { User };
