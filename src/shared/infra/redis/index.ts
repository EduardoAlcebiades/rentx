import * as redis from 'redis';

const client = redis.createClient({
  legacyMode: true,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    sessionTimeout: Number(process.env.REDIS_SESSION_TIMEOUT),
  },
});

async function connect(): Promise<void> {
  await client.connect();
}

export { client, connect };
