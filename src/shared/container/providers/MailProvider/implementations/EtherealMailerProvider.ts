import fs from 'fs';
import handlebars from 'handlebars';
import nodemailer from 'nodemailer';

import transporterConfig from '../../../../../config/transporter';
import { ISendMailDTO } from '../dtos/ISendMailDTO';
import { IMailProvider } from '../IMailProvider';

class EtherealMailerProvider implements IMailProvider {
  async sendMail({
    to,
    subject,
    variables,
    path,
  }: ISendMailDTO): Promise<void> {
    const client = await transporterConfig.getClient();

    const templateFileContent = fs.readFileSync(path).toString('utf-8');
    const templateParsed = handlebars.compile(templateFileContent);
    const templateHTML = templateParsed(variables);

    const message = await client.sendMail({
      from: process.env.HOST_MAIL,
      to,
      subject,
      html: templateHTML,
    });

    console.log(`Preview e-mail URL: ${nodemailer.getTestMessageUrl(message)}`);
  }
}

export { EtherealMailerProvider };
