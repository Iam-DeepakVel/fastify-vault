import { FastifyReply } from 'fastify/types/reply';
import { FastifyRequest } from 'fastify/types/request';
import { get } from 'lodash';
import { updateVault } from './vault.service';
import { fastify } from '../../main';

export async function updateVaultHandler(
  request: FastifyRequest<{
    Body: {
      encryptedVault: string;
    };
  }>,
  reply: FastifyReply
) {
  const { encryptedVault } = request.body;

  //! Declare type globally for jwt payload before getting _id from user object
  const userId = get(request, 'user._id');

  try {
    await updateVault({
      data: encryptedVault,
      userId,
    });
    return reply.code(200).send('Vault Updated');
  } catch (error) {
    fastify.log.error(error, 'Error updating vault');
    return reply.code(500).send(error);
  }
}
