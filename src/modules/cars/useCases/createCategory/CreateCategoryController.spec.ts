import request from 'supertest';

import { app } from '../../../../shared/infra/http/app';

describe('Create Category Controller', () => {
  it('teste', async () => {
    const response = await request(app).post('/cars/available');

    expect(response.status).toBe(401);
  });
});
