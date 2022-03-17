import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '../../../../config/upload';
import { CreateCarController } from '../../../../modules/cars/useCases/createCar/CreateCarController';
import { CreateCarSpecificationController } from '../../../../modules/cars/useCases/createCarSpecification/CreateCarSpecificationController';
import { ListAvailableCarsController } from '../../../../modules/cars/useCases/listAvailableCars/ListAvailableCarsController';
import { UploadCarImageController } from '../../../../modules/cars/useCases/uploadCarImages/UploadCarImagesController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { ensureIsAdmin } from '../middlewares/ensureIsAdmin';

const carsRoutes = Router();

const upload = multer({ storage: uploadConfig.storage });

const createCarController = new CreateCarController();
const listAvailableCarsController = new ListAvailableCarsController();
const createCarSpecificationController = new CreateCarSpecificationController();
const uploadCarImageController = new UploadCarImageController();

carsRoutes.post(
  '/',
  ensureAuthenticated,
  ensureIsAdmin,
  createCarController.handle,
);

carsRoutes.get('/available', listAvailableCarsController.handle);
carsRoutes.patch(
  '/:id/specifications',
  ensureAuthenticated,
  ensureIsAdmin,
  createCarSpecificationController.handle,
);
carsRoutes.patch(
  '/:id/images',
  ensureAuthenticated,
  ensureIsAdmin,
  upload.array('images'),
  uploadCarImageController.handle,
);

export { carsRoutes };
