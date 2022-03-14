import nodemailer, { Transporter } from 'nodemailer';

async function getClient(): Promise<Transporter> {
  const account = await nodemailer.createTestAccount();

  const client = nodemailer.createTransport({
    host: account.smtp.host,
    port: account.smtp.port,
    secure: account.smtp.secure,
    auth: {
      user: account.user,
      pass: account.pass,
    },
  });

  return client;
}

const transporterConfig = { getClient };

export default transporterConfig;
