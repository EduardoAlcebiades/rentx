import { Connection, createConnection, getConnectionOptions } from 'typeorm';

async function connect(): Promise<Connection> {
  const defaultOptions = await getConnectionOptions();

  const connection = await createConnection(
    Object.assign(defaultOptions, {
      database:
        process.env.NODE_ENV === 'test'
          ? 'rentx_test'
          : defaultOptions.database,
    }),
  );

  return connection;
}

export { connect };
