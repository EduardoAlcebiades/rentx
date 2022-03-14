import 'reflect-metadata';
import 'express-async-errors';

import cors from 'cors';
import express from 'express';
import swagger from 'swagger-ui-express';

import '../../container';

import swaggerFile from '../../../swagger.json';
import { connect } from '../typeorm';
import { errorHandler } from './middlewares/errorHandler';
import { routes } from './routes';

connect('localhost')
  .then(() => console.log('Database connected successful!'))
  .catch(err => console.error(err));

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api-docs', swagger.serve, swagger.setup(swaggerFile));
app.use(routes);
app.use(errorHandler);

export { app };
