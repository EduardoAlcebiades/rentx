import { hashSync } from 'bcryptjs';
import { inject, injectable } from 'tsyringe';

import { IDateProvider } from '../../../../shared/container/providers/DateProvider/IDateProvider';
import { AppError } from '../../../../shared/errors/AppError';
import { IUsersRepository } from '../../repositories/IUsersRepository';
import { IUserTokensRepository } from '../../repositories/IUserTokensRepository';

interface IRequest {
  token: string;
  password: string;
}

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider,
  ) {}

  async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.userTokensRepository.findByRefreshToken(token);

    if (!userToken) throw new AppError('Invalid token!', 401);

    const currentDate = this.dateProvider.currentDate();

    if (this.dateProvider.isBefore(userToken.expires_date, currentDate))
      throw new AppError('Invalid token', 401);

    const user = await this.usersRepository.findById(userToken.user_id);

    if (!user) throw new AppError('User not found', 404);

    user.password = hashSync(password, 8);

    await this.usersRepository.create(user);
    await this.userTokensRepository.deleteByUserId(userToken.user_id);
  }
}

export { ResetPasswordService };
