import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { RegisterUserUseCase } from '../../application/use-cases/RegisterUserUseCase';
import { LoginUserUseCase } from '../../application/use-cases/LoginUserUseCase';
import { AddBalanceUseCase } from '../../application/use-cases/AddBalanceUseCase';

export function authController(
  registerUseCase: RegisterUserUseCase,
  loginUseCase: LoginUserUseCase,
  addBalanceUseCase: AddBalanceUseCase
) {
  return async function (fastify: FastifyInstance) {
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

    fastify.post('/api/account/add-balance', async (request: FastifyRequest, reply: FastifyReply) => {
      const body = request.body as { userId: string; amount: number };
      const result = await addBalanceUseCase.execute(body);
      reply.status(200).send({ freeBalance: result.freeBalance });
    });
  };
}
