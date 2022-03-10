import { inject, injectable } from 'tsyringe';
import { validate } from 'uuid';

import { AppError } from '../../../../shared/errors/AppError';
import { Car } from '../../infra/typeorm/entities/Car';
import { ICarsRepository } from '../../repositories/ICarsRepository';
import { ISpecificationsRepository } from '../../repositories/ISpecificationsRepository';

interface IRequest {
  car_id: string;
  specificationIds: string[];
}

@injectable()
class CreateCarSpecificationService {
  constructor(
    @inject('CarsRepository')
    private carsRepository: ICarsRepository,
    @inject('SpecificationsRepository')
    private specificationsRepository: ISpecificationsRepository,
  ) {}

  async execute({ car_id, specificationIds }: IRequest): Promise<Car> {
    if (!validate(car_id)) throw new AppError('car_id is not a valid uuid');

    specificationIds.forEach(specification_id => {
      if (!validate(specification_id))
        throw new AppError('specificationIds contains a not valid uuid');
    });

    const car = await this.carsRepository.findById(car_id);

    if (!car) throw new AppError('Car not found!', 404);

    const specifications = await this.specificationsRepository.findByIds(
      specificationIds,
    );

    car.specifications = specifications;

    await this.carsRepository.create(car);

    return car;
  }
}

export { CreateCarSpecificationService };
