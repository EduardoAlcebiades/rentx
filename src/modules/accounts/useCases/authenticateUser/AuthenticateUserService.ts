import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import authConfig from '../../../../config/auth';
import { IDateProvider } from '../../../../shared/container/providers/DateProvider/IDateProvider';
import { AppError } from '../../../../shared/errors/AppError';
import { IUsersRepository } from '../../repositories/IUsersRepository';
import { IUserTokensRepository } from '../../repositories/IUserTokensRepository';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  token: string;
  refresh_token: string;
  user: {
    name: string;
    email: string;
  };
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
    @inject('DateProvider')
    private dateProvider: IDateProvider,
  ) {}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) throw new AppError('Email or password is incorrect!', 401);

    const passwordIsMatch = await compare(password, user.password);

    if (!passwordIsMatch)
      throw new AppError('Email or password is incorrect!', 401);

    const token = sign({}, authConfig.token.secret, {
      subject: user.id,
      expiresIn: authConfig.token.expiresIn,
    });

    const refresh_token = sign(
      { name: user.name, email },
      authConfig.refreshToken.secret,
      {
        subject: user.id,
        expiresIn: authConfig.refreshToken.expiresIn,
      },
    );

    const currentDate = this.dateProvider.currentDate();
    const expires_date = this.dateProvider.addDays(
      authConfig.refreshToken.expiresInDays,
      currentDate,
    );

    await this.userTokensRepository.create({
      user_id: user.id,
      expires_date,
      refresh_token,
    });

    const response: IResponse = {
      token,
      refresh_token,
      user: {
        name: user.name,
        email,
      },
    };

    return response;
  }
}

export { AuthenticateUserService };
