import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import authConfig from '../../../../config/auth';
import { IDateProvider } from '../../../../shared/container/providers/DateProvider/IDateProvider';
import { AppError } from '../../../../shared/errors/AppError';
import { IUserTokensRepository } from '../../repositories/IUserTokensRepository';

interface IPayload extends JwtPayload {
  name: string;
  email: string;
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
class RefreshTokenService {
  constructor(
    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
    @inject('DateProvider')
    private dateProvider: IDateProvider,
  ) {}

  async execute(refresh_token: string): Promise<IResponse> {
    const userToken = await this.userTokensRepository.findByRefreshToken(
      refresh_token,
    );

    if (!userToken) throw new AppError('Invalid refresh token!', 401);

    await this.userTokensRepository.deleteById(userToken.id);

    const currentDate = this.dateProvider.currentDate();

    if (this.dateProvider.isBefore(userToken.expires_date, currentDate))
      throw new AppError('Token has been expired!', 401);

    let name: string;
    let email: string;

    try {
      const decoded = verify(
        refresh_token,
        authConfig.refreshToken.secret,
      ) as IPayload;

      name = decoded.name;
      email = decoded.email;
    } catch (err) {
      throw new AppError('The token is invalid or expired!', 401);
    }

    const { user_id } = userToken;

    const token = sign({}, authConfig.token.secret, {
      subject: user_id,
      expiresIn: authConfig.token.expiresIn,
    });

    const new_refresh_token = sign(
      { name, email },
      authConfig.refreshToken.secret,
      {
        subject: user_id,
        expiresIn: authConfig.refreshToken.expiresIn,
      },
    );

    const expires_date = this.dateProvider.addDays(
      authConfig.refreshToken.expiresInDays,
      currentDate,
    );

    await this.userTokensRepository.create({
      user_id,
      expires_date,
      refresh_token: new_refresh_token,
    });

    const response: IResponse = {
      token,
      refresh_token: new_refresh_token,
      user: { name, email },
    };

    return response;
  }
}

export { RefreshTokenService };
