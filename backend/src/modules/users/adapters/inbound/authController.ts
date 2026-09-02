import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { RegisterUserUseCase } from '../../application/use-cases/RegisterUserUseCase';
import { LoginUserUseCase } from '../../application/use-cases/LoginUserUseCase';
import { AddBalanceUseCase } from '../../application/use-cases/AddBalanceUseCase';

import { IUserRepository } from '../../application/ports/outbound/IUserRepository';
import { JwtTokenAdapter } from '../outbound/JwtTokenAdapter';

export function authController(
  registerUseCase: RegisterUserUseCase,
  loginUseCase: LoginUserUseCase,
  addBalanceUseCase: AddBalanceUseCase,
  userRepository: IUserRepository,
  jwtAdapter: JwtTokenAdapter
) {
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
    fastify.get('/api/users/me', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = (request as any).user.userId;
      const user = await userRepository.findById(userId);
      if (!user) return reply.status(404).send({ error: 'User not found' });
      reply.status(200).send(user);
    });

    fastify.post('/api/auth/register', async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const result = await registerUseCase.execute(request.body as any);
        reply.status(201).send(result);
      } catch (err: any) {
        if (err.message === 'Email already exists') {
          reply.status(400).send({ error: err.message });
        } else {
          throw err;
        }
      }
    });

    fastify.post('/api/auth/login', async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const result = await loginUseCase.execute(request.body as any);
        reply.status(200).send(result);
      } catch (err: any) {
        if (err.message === 'Invalid credentials') {
          reply.status(401).send({ error: err.message });
        } else {
          throw err;
        }
      }
    });

    fastify.post('/api/account/add-balance', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
      const user = (request as any).user;
      const body = request.body as { amount: number };
      const result = await addBalanceUseCase.execute({ userId: user.userId, amount: body.amount });
      reply.status(200).send({ freeBalance: result.freeBalance });
    });
  };
}
