import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { CreateCharacterUseCase } from '../../application/use-cases/CreateCharacterUseCase';
import { ListCharactersUseCase } from '../../application/use-cases/ListCharactersUseCase';
import { JwtTokenAdapter } from '../../../users/adapters/outbound/JwtTokenAdapter';

export function characterController(
  createCharacterUseCase: CreateCharacterUseCase,
  listCharactersUseCase: ListCharactersUseCase
) {
  const jwtAdapter = new JwtTokenAdapter();

  const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader) throw new Error('No token provided');
      const token = authHeader.replace('Bearer ', '');
      const decoded = jwtAdapter.verify(token);
      (request as any).user = decoded;
    } catch (err) {
      reply.status(401).send({ error: 'Unauthorized' });
      throw err;
    }
  };

  return async function (fastify: FastifyInstance) {
    fastify.post('/api/characters', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
      const user = (request as any).user;
      const body = request.body as { name: string; level: number; vocation: string };
      const result = await createCharacterUseCase.execute({
        ...body,
        ownerId: user.userId
      });
      reply.status(201).send(result);
    });

    fastify.get('/api/characters/me', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
      const user = (request as any).user;
      const result = await listCharactersUseCase.execute({ ownerId: user.userId });
      reply.status(200).send(result);
    });

    fastify.get('/api/characters', async (request: FastifyRequest, reply: FastifyReply) => {
      const result = await listCharactersUseCase.execute({});
      reply.status(200).send(result);
    });
  };
}
