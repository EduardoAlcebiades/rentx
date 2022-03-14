import { Router } from 'express';

import { authenticateRoutes } from './authenticate.routes';
import { carsRoutes } from './cars.routes';
import { categoriesRoutes } from './categories.routes';
import { passwordRoutes } from './password.routes';
import { rentalsRoutes } from './rentals.routes';
import { specificationsRoutes } from './specifications.routes';
import { usersRoutes } from './users.routes';

const routes = Router();

routes.use('/auth', authenticateRoutes);
routes.use('/passwd', passwordRoutes);
routes.use('/users', usersRoutes);
routes.use('/categories', categoriesRoutes);
routes.use('/specifications', specificationsRoutes);
routes.use('/cars', carsRoutes);
routes.use('/rentals', rentalsRoutes);

export { routes };
