import { hash } from 'bcryptjs';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

import { app } from '../../../../shared/infra/http/app';
import { connect } from '../../../../shared/infra/typeorm';
import { ICreateCategoryDTO } from '../../dtos/ICreateCategoryDTO';

let connection: Connection;
let token: string;

interface IUser {
  id: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

describe('List Category Controller', () => {
  async function createUser(
    connection: Connection,
    { id, email, password, isAdmin }: IUser,
  ): Promise<string> {
    const passwordHash = await hash(password, 8);

    await connection.query(
      `INSERT INTO users(id, name, email, password, is_admin, driver_license, created_at)
      values('${id}', 'admin', '${email}', '${passwordHash}', ${isAdmin}, 'XXXXXX', 'now()');`,
    );

    const authResponse = await request(app)
      .post('/auth')
      .send({ email, password });

    return authResponse.body.token;
  }

  beforeAll(async () => {
    connection = await connect();

    await connection.dropDatabase();
    await connection.runMigrations();

    const user1: IUser = {
      id: uuidV4(),
      email: 'admin@rentx.com',
      password: 'admin',
      isAdmin: true,
    };

    token = await createUser(connection, user1);
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should be able to list all categories', async () => {
    const category1: ICreateCategoryDTO = {
      name: 'Sample Name 1',
      description: 'Sample description',
    };
    const category2: ICreateCategoryDTO = {
      name: 'Sample Name 2',
      description: 'Sample description',
    };
    const category3: ICreateCategoryDTO = {
      name: 'Sample Name 3',
      description: 'Sample description',
    };

    await request(app)
      .post('/categories')
      .set({ Authorization: `Bearer ${token}` })
      .send(category1);

    await request(app)
      .post('/categories')
      .set({ Authorization: `Bearer ${token}` })
      .send(category2);

    await request(app)
      .post('/categories')
      .set({ Authorization: `Bearer ${token}` })
      .send(category3);

    const response = await request(app).get('/categories');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject([category1, category2, category3]);
  });
});
