import { Router } from 'express';

import { CreateRentalController } from '../../../../modules/rentals/useCases/createRental/CreateRentalController';
import { DevolutionRentalController } from '../../../../modules/rentals/useCases/devolutionRental/DevolutionRentalController';
import { ListRentalsByUserController } from '../../../../modules/rentals/useCases/listRentalsByUser/ListRentalsByUserController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

const rentalsRoutes = Router();

const createRentalController = new CreateRentalController();
const devolutionRentalController = new DevolutionRentalController();
const listRentalsByUserController = new ListRentalsByUserController();

rentalsRoutes.post('/', ensureAuthenticated, createRentalController.handle);
rentalsRoutes.get(
  '/byUser',
  ensureAuthenticated,
  listRentalsByUserController.handle,
);
rentalsRoutes.patch(
  '/:id/devolution',
  ensureAuthenticated,
  devolutionRentalController.handle,
);

export { rentalsRoutes };
