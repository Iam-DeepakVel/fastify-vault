import createServer from './utils/createServer';
import { connectDB } from './utils/db';
import fastifyEnv from '@fastify/env';

export const fastify = createServer();

// Run the server
fastify.listen({ port: 4000 }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }

  connectDB();

  fastify.log.info(`Server is now listening on ${address}`);
});
