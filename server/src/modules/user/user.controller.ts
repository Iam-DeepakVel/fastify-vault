import { FastifyReply } from 'fastify/types/reply';
import { FastifyRequest } from 'fastify/types/request';
import {
  createUser,
  findUserByEmailAndPassword,
  generateSalt,
} from './user.service';
import { createVault, findVaultByUser } from '../vault/vault.service';
import { fastify } from '../../main';

export async function registerUserHandler(
  request: FastifyRequest<{
    Body: Parameters<typeof createUser>[number];
  }>,
  reply: FastifyReply
) {
  const body = request.body;
  try {
    const user = await createUser(body);

    const salt = generateSalt();

    const vault = await createVault({
      user: user._id.toString(),
      salt,
    });

    const accessToken = await reply.jwtSign({
      _id: user._id,
      email: user.email,
    });

    reply.setCookie('accessToken', accessToken, {
      domain: process.env.COOKIE_DOMAIN || 'localhost',
      path: '/',
      // If make true, then cookie can be sent only through https connection
      // So make it true for production
      secure: false,
      // Cookie only can acessed by http
      httpOnly: true,
      sameSite: false,
    });

    return reply.code(201).send({ accessToken, vault: vault.data, salt });
  } catch (error) {
    fastify.log.error(error, 'Error createing user');
    return reply.code(500).send(error);
  }
}

export async function loginHandler(
  request: FastifyRequest<{
    Body: Parameters<typeof createUser>[number];
  }>,
  reply: FastifyReply
) {
  const user = await findUserByEmailAndPassword(request.body);
  if (!user) {
    return reply.status(401).send({
      message: 'Invalid Credentials',
    });
  }

  const vault = await findVaultByUser(user._id.toString());

  const accessToken = await reply.jwtSign({
    _id: user._id,
    email: user.email,
  });

  reply.setCookie('accessToken', accessToken, {
    domain: process.env.COOKIE_DOMAIN || 'localhost',
    path: '/',
    // If make true, then cookie can be sent only through https connection
    // So make it true for production
    secure: false,
    // Cookie only can acessed by http
    httpOnly: true,
    sameSite: false,
  });

  return reply
    .code(200)
    .send({ accessToken, vault: vault?.data, salt: vault?.salt });
}
