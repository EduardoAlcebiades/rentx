import { decode } from 'jsonwebtoken';

import { AppError } from '../../../../shared/errors/AppError';
import { ICreateUserDTO } from '../../dtos/ICreateUserDTO';
import { UsersRepositoryInMemory } from '../../repositories/inMemory/UsersRepositoryInMemory';
import { IUsersRepository } from '../../repositories/IUsersRepository';
import { CreateUserService } from '../createUser/CreateUserService';
import { AuthenticateUserService } from './AuthenticateUserService';

let usersRepository: IUsersRepository;
let authenticateUserService: AuthenticateUserService;
let createUserService: CreateUserService;

describe('Authenticate User', () => {
  const user: ICreateUserDTO = {
    name: 'Test Auth',
    email: 'sample@email.com',
    password: '1234',
    driver_license: '123456abcd',
  };

  beforeEach(async () => {
    usersRepository = new UsersRepositoryInMemory();
    authenticateUserService = new AuthenticateUserService(usersRepository);
    createUserService = new CreateUserService(usersRepository);
  });

  it('should be able to authenticate an user', async () => {
    await createUserService.execute(user);
    const createdUser = await usersRepository.findByEmail(user.email);

    const result = await authenticateUserService.execute({
      email: user.email,
      password: user.password,
    });

    const decodedToken = decode(result.token);

    expect(decodedToken.sub).toEqual(createdUser.id);
    expect(result.user.name).toEqual(user.name);
    expect(result.user.email).toEqual(user.email);
  });

  it('should not be able to authenticate a non existent user', () => {
    expect(async () => {
      await authenticateUserService.execute({
        email: user.email,
        password: user.password,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate a user with wrong password', async () => {
    await createUserService.execute(user);

    expect(async () => {
      await authenticateUserService.execute({
        email: user.email,
        password: `worng${user.password}`,
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
