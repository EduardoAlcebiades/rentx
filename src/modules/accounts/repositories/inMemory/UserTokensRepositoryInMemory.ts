import { ICreateUserTokenDTO } from '../../dtos/ICreateUserTokenDTO';
import { UserToken } from '../../infra/typeorm/entities/UserToken';
import { IUserTokensRepository } from '../IUserTokensRepository';

class UserTokensRepositoryInMemory implements IUserTokensRepository {
  private userTokens: UserToken[];

  constructor() {
    this.userTokens = [];
  }

  async findByRefreshToken(refresh_token: string): Promise<UserToken> {
    const userToken = this.userTokens.find(
      userToken => userToken.refresh_token === refresh_token,
    );

    return userToken;
  }

  async create({
    user_id,
    expires_date,
    refresh_token,
  }: ICreateUserTokenDTO): Promise<void> {
    const userToken = new UserToken();

    Object.assign(userToken, {
      user_id,
      expires_date,
      refresh_token,
    });

    this.userTokens.push(userToken);
  }

  async deleteById(id: string): Promise<void> {
    const index = this.userTokens.findIndex(userToken => userToken.id === id);

    this.userTokens.splice(index);
  }

  async deleteByUserId(user_id: string): Promise<void> {
    this.userTokens = this.userTokens.filter(
      userToken => userToken.user_id !== user_id,
    );
  }
}

export { UserTokensRepositoryInMemory };
