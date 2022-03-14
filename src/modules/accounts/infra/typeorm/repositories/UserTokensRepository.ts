import { EntityRepository, getRepository, Repository } from 'typeorm';

import { ICreateUserTokenDTO } from '../../../dtos/ICreateUserTokenDTO';
import { IUserTokensRepository } from '../../../repositories/IUserTokensRepository';
import { UserToken } from '../entities/UserToken';

@EntityRepository()
class UserTokensRepository implements IUserTokensRepository {
  private repository: Repository<UserToken>;

  constructor() {
    this.repository = getRepository(UserToken);
  }

  async findByRefreshToken(refresh_token: string): Promise<UserToken> {
    const userToken = await this.repository.findOne({ refresh_token });

    return userToken;
  }

  async create({
    user_id,
    expires_date,
    refresh_token,
  }: ICreateUserTokenDTO): Promise<void> {
    const userToken = this.repository.create({
      user_id,
      expires_date,
      refresh_token,
    });

    await this.repository.save(userToken);
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async deleteByUserId(user_id: string): Promise<void> {
    await this.repository.delete({ user_id });
  }
}

export { UserTokensRepository };
