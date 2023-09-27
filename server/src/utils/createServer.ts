import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import fs from 'fs';
import path from 'path';
import fastifyCookie from '@fastify/cookie';
import userRoutes from '../modules/user/user.route';
import vaultRoutes from '../modules/vault/vault.route';
import fastifyEnv from '@fastify/env';

declare module 'fastify' {
  export interface FastifyInstance {
    authenticate: any;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: {
      _id: string;
    };
  }
}

function createServer() {
  const app = Fastify({
    logger: {
      transport: {
        target: 'pino-pretty',
      },
    },
  });
 
  app
    .register(fastifyEnv, {
      dotenv: true,
      schema: {
    type: 'object',
    required: ['MONGO_URI'],
    properties: {
      MONGO_URI: {
        type: 'string',
        default: '',
      },
    },
  },
    })
    .ready((err) => {
      if (err) console.error(err);
    });

  app.register(fastifyCors, {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });

  app.register(fastifyJwt, {
    secret: {
      private: fs.readFileSync(
        `${(path.join(process.cwd()), 'certs')}/private.key`
      ),
      public: fs.readFileSync(
        `${(path.join(process.cwd()), 'certs')}/public.key`
      ),
    },
    sign: { algorithm: 'RS256' },
    cookie: {
      cookieName: 'accessToken',
      signed: false,
    },
  });

  app.register(fastifyCookie, {
    parseOptions: {},
  });

  app.decorate(
    'authenticate',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const user = await request.jwtVerify<{
          _id: string;
        }>();
        request.user = user;
      } catch (error) {
        return reply.send(error);
      }
    }
  );

  app.register(userRoutes, { prefix: 'api/users' });
  app.register(vaultRoutes, { prefix: 'api/vaults' });

  return app;
}

export default createServer;
