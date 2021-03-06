import { decode } from 'jsonwebtoken';

import { IDateProvider } from '../../../../shared/container/providers/DateProvider/IDateProvider';
import { DayjsDateProvider } from '../../../../shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { AppError } from '../../../../shared/errors/AppError';
import { ICreateUserDTO } from '../../dtos/ICreateUserDTO';
import { UsersRepositoryInMemory } from '../../repositories/inMemory/UsersRepositoryInMemory';
import { UserTokensRepositoryInMemory } from '../../repositories/inMemory/UserTokensRepositoryInMemory';
import { IUsersRepository } from '../../repositories/IUsersRepository';
import { IUserTokensRepository } from '../../repositories/IUserTokensRepository';
import { CreateUserService } from '../createUser/CreateUserService';
import { AuthenticateUserService } from './AuthenticateUserService';

let usersRepository: IUsersRepository;
let userTokensRepository: IUserTokensRepository;
let dateProvider: IDateProvider;
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
    userTokensRepository = new UserTokensRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    authenticateUserService = new AuthenticateUserService(
      usersRepository,
      userTokensRepository,
      dateProvider,
    );
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

  it('should not be able to authenticate a non existent user', async () => {
    expect.assertions(3);

    try {
      await authenticateUserService.execute({
        email: user.email,
        password: user.password,
      });
    } catch (err: unknown) {
      expect(err).toBeInstanceOf(AppError);
      expect(err).toHaveProperty('message');
      expect((err as AppError).statusCode).toBe(401);
    }
  });

  it('should not be able to authenticate a user with wrong password', async () => {
    await createUserService.execute(user);

    expect.assertions(3);

    try {
      await authenticateUserService.execute({
        email: user.email,
        password: `worng${user.password}`,
      });
    } catch (err: unknown) {
      expect(err).toBeInstanceOf(AppError);
      expect(err).toHaveProperty('message');
      expect((err as AppError).statusCode).toBe(401);
    }
  });
});
