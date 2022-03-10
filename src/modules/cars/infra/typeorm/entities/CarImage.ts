import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

@Entity('car_images')
class CarImage {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  image_name: string;

  @CreateDateColumn()
  created_at: Date;

  @Column('uuid')
  car_id: string;

  constructor() {
    if (!this.id) this.id = uuidV4();
  }
}

export { CarImage };
