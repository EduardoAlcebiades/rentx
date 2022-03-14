import { ICreateRentalDTO } from '../dtos/ICreateRentalDTO';
import { Rental } from '../infra/typeorm/entities/Rental';

interface IRentalsRepository {
  findById(id: string): Promise<Rental>;
  findByUser(user_id: string): Promise<Rental[]>;
  findActiveRentalByUser(user_id: string): Promise<Rental>;
  findActiveRentalByCar(car_id: string): Promise<Rental>;
  create({
    car_id,
    expected_return_date,
    user_id,
  }: ICreateRentalDTO): Promise<Rental>;
}

export { IRentalsRepository };
