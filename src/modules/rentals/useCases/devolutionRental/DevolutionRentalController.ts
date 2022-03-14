import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { DevolutionRentalService } from './DevolutionRentalService';

class DevolutionRentalController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const devolutionRentalService = container.resolve(DevolutionRentalService);
    const rental = await devolutionRentalService.execute({ rental_id: id });

    return response.json(rental);
  }
}

export { DevolutionRentalController };
