import { createConnection, getConnectionOptions } from 'typeorm';

async function connect(host = 'database'): Promise<void> {
  const defaultOptions = await getConnectionOptions();

  await createConnection(
    Object.assign(defaultOptions, {
      host: process.env.NODE_ENV === 'test' ? 'localhost' : host,
      database:
        process.env.NODE_ENV === 'test'
          ? 'rentx_test'
          : defaultOptions.database,
    }),
  );
}

export { connect };
