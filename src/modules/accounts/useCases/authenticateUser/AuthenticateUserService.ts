import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import { AppError } from '../../../../shared/errors/AppError';
import { IUsersRepository } from '../../repositories/IUsersRepository';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  token: string;
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
  ) {}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const SECRET = '3e79faab4dfe99dcfd772f936c0086d0cbf6571a';
    const user = await this.usersRepository.findByEmail(email);

    if (!user) throw new AppError('Email or password is incorrect!', 401);

    const passwordIsMatch = await compare(password, user.password);

    if (!passwordIsMatch)
      throw new AppError('Email or password is incorrect!', 401);

    const token = sign({}, SECRET, {
      subject: user.id,
      expiresIn: '1d',
    });

    const response: IResponse = {
      token,
      user: {
        name: user.name,
        email,
      },
    };

    return response;
  }
}

export { AuthenticateUserService };
