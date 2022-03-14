import { hashSync } from 'bcryptjs';
import path from 'path';
import { inject, injectable } from 'tsyringe';

import { IDateProvider } from '../../../../shared/container/providers/DateProvider/IDateProvider';
import { IMailProvider } from '../../../../shared/container/providers/MailProvider/IMailProvider';
import { AppError } from '../../../../shared/errors/AppError';
import { IUsersRepository } from '../../repositories/IUsersRepository';
import { IUserTokensRepository } from '../../repositories/IUserTokensRepository';

@injectable()
class SendForgotPasswordMailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider,
    @inject('EtherealMailerProvider')
    private mailProvider: IMailProvider,
  ) {}

  async execute(email: string, resetPasswordUrl?: string): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user)
      throw new AppError('This email is not registered in our database!', 404);

    const s = `${user.id}-${new Date().getTime()}`;
    const hash = hashSync(s, 8);
    const expires_date = this.dateProvider.addHours(3);

    await this.userTokensRepository.create({
      user_id: user.id,
      expires_date,
      refresh_token: hash,
    });

    const variables = {
      name: user.name,
      link: `${resetPasswordUrl || process.env.FORGOT_MAIL_URL}?token=${hash}`,
    };
    const templatePath = path.resolve(
      __dirname,
      '..',
      '..',
      'views',
      'emails',
      'forgotPassword.hbs',
    );

    await this.mailProvider.sendMail({
      to: email,
      subject: 'Recuperação de Senha RentX',
      variables,
      path: templatePath,
    });
  }
}

export { SendForgotPasswordMailService };
