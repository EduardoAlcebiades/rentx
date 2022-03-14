import { ICreateUserTokenDTO } from '../dtos/ICreateUserTokenDTO';
import { UserToken } from '../infra/typeorm/entities/UserToken';

interface IUserTokensRepository {
  findByRefreshToken(refresh_token: string): Promise<UserToken>;
  create({
    user_id,
    expires_date,
    refresh_token,
  }: ICreateUserTokenDTO): Promise<void>;
  deleteById(id: string): Promise<void>;
  deleteByUserId(user_id: string): Promise<void>;
}

export { IUserTokensRepository };
