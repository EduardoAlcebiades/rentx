import { ISendMailDTO } from './dtos/ISendMailDTO';

interface IMailProvider {
  sendMail({ to, subject, variables, path }: ISendMailDTO): Promise<void>;
}

export { IMailProvider };
