import { IDateProvider } from '../../../../shared/container/providers/DateProvider/IDateProvider';
import { DayjsDateProvider } from '../../../../shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import { IMailProvider } from '../../../../shared/container/providers/MailProvider/IMailProvider';
import { MailProviderInMemory } from '../../../../shared/container/providers/MailProvider/inMemory/MailProviderInMemory';
import { AppError } from '../../../../shared/errors/AppError';
import { ICreateUserDTO } from '../../dtos/ICreateUserDTO';
import { UsersRepositoryInMemory } from '../../repositories/inMemory/UsersRepositoryInMemory';
import { UserTokensRepositoryInMemory } from '../../repositories/inMemory/UserTokensRepositoryInMemory';
import { IUsersRepository } from '../../repositories/IUsersRepository';
import { IUserTokensRepository } from '../../repositories/IUserTokensRepository';
import { CreateUserService } from '../createUser/CreateUserService';
import { SendForgotPasswordMailService } from './SendForgotPasswordMailService';

let usersRepository: IUsersRepository;
let userTokensRepository: IUserTokensRepository;
let dateProvider: IDateProvider;
let mailProvider: IMailProvider;
let createUserService: CreateUserService;
let sendForgotPasswordMailService: SendForgotPasswordMailService;

describe('Send Forgot Password Mail', () => {
  const user: ICreateUserDTO = {
    name: 'Sample Name',
    email: 'sample@email.com',
    password: '1234',
    driver_license: '123456abcd',
  };

  beforeEach(() => {
    usersRepository = new UsersRepositoryInMemory();
    userTokensRepository = new UserTokensRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    mailProvider = new MailProviderInMemory();
    createUserService = new CreateUserService(usersRepository);
    sendForgotPasswordMailService = new SendForgotPasswordMailService(
      usersRepository,
      userTokensRepository,
      dateProvider,
      mailProvider,
    );
  });

  it('should be able to send a forgot password mail to user', async () => {
    await createUserService.execute(user);

    const sendMail = jest.spyOn(mailProvider, 'sendMail');
    const create = jest.spyOn(userTokensRepository, 'create');

    await sendForgotPasswordMailService.execute(user.email);

    expect(sendMail).toHaveBeenCalled();
    expect(create).toHaveBeenCalled();
  });

  it('should not be able to send a forgot password email when user does not exist', async () => {
    expect.assertions(3);

    try {
      await sendForgotPasswordMailService.execute(user.email);
    } catch (err: unknown) {
      expect(err).toBeInstanceOf(AppError);
      expect(err).toHaveProperty('message');
      expect((err as AppError).statusCode).toBe(404);
    }
  });
});
