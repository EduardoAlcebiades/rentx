import { container } from 'tsyringe';

import { IDateProvider } from './DateProvider/IDateProvider';
import { DayjsDateProvider } from './DateProvider/implementations/DayjsDateProvider';
import { IMailProvider } from './MailProvider/IMailProvider';
import { EtherealMailerProvider } from './MailProvider/implementations/EtherealMailerProvider';

container.registerSingleton<IDateProvider>(
  'DayjsDateProvider',
  DayjsDateProvider,
);

container.registerSingleton<IMailProvider>(
  'EtherealMailerProvider',
  EtherealMailerProvider,
);
