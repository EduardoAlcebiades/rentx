import { hash } from 'bcryptjs';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

import { app } from '../../../../shared/infra/http/app';
import { connect } from '../../../../shared/infra/typeorm';

let connection: Connection;
let token: string;
let tokenNoAdmin: string;

interface IUser {
  id: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

describe('Create Category Controller', () => {
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

    const user2: IUser = {
      id: uuidV4(),
      email: 'no-admin@rentx.com',
      password: 'noadmin',
      isAdmin: false,
    };

    token = await createUser(connection, user1);
    tokenNoAdmin = await createUser(connection, user2);
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should be able to create a new category', async () => {
    const response = await request(app)
      .post('/categories')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        name: 'Sample Name 1',
        description: 'Sample description',
      });

    expect(response.status).toBe(201);
  });

  it('should not be able to create a new category when the user was not an admin', async () => {
    const response = await request(app)
      .post('/categories')
      .set({ Authorization: `Bearer ${tokenNoAdmin}` })
      .send({
        name: 'Sample Name 2',
        description: 'Sample description',
      });

    expect(response.status).toBe(403);
  });

  it('should not be able to create a new category when the request headers not had an authorization token', async () => {
    const response = await request(app).post('/categories').send({
      name: 'Sample Name 3',
      description: 'Sample description',
    });

    expect(response.status).toBe(401);
  });

  it('should not be able to create a new category when the name already exists', async () => {
    const response = await request(app)
      .post('/categories')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        name: 'Sample Name 1',
        description: 'Sample description',
      });

    expect(response.status).toBe(409);
  });
});
