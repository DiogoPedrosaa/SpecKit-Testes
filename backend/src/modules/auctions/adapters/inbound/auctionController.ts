import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { CreateAuctionUseCase } from '../../application/use-cases/CreateAuctionUseCase';
import { PlaceBidUseCase } from '../../application/use-cases/PlaceBidUseCase';
import { GetUserAuctionHistoryUseCase } from '../../application/use-cases/GetUserAuctionHistoryUseCase';
import { IAuctionRepository } from '../../application/ports/outbound/IAuctionRepository';
import { JwtTokenAdapter } from '../../../users/adapters/outbound/JwtTokenAdapter';

export function auctionController(
  createAuctionUseCase: CreateAuctionUseCase,
  placeBidUseCase: PlaceBidUseCase,
  getUserAuctionHistoryUseCase: GetUserAuctionHistoryUseCase,
  auctionRepo: IAuctionRepository
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
    fastify.post('/api/auctions', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
      const user = (request as any).user;
      const body = request.body as { characterId: string; startPrice: number; endTime: string };
      try {
        const result = await createAuctionUseCase.execute({
          characterId: body.characterId,
          sellerId: user.userId,
          startPrice: body.startPrice,
          endTime: new Date(body.endTime)
        });
        reply.status(201).send(result);
      } catch (error: any) {
        reply.status(400).send({ error: error.message });
      }
    });

    fastify.post('/api/auctions/:id/bids', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
      const user = (request as any).user;
      const params = request.params as { id: string };
      const body = request.body as { amount: number };
      
      try {
        const result = await placeBidUseCase.execute({
          auctionId: params.id,
          bidderId: user.userId,
          amount: body.amount
        });
        reply.status(201).send(result);
      } catch (error: any) {
        reply.status(400).send({ error: error.message });
      }
    });

    fastify.get('/api/auctions', async (request: FastifyRequest, reply: FastifyReply) => {
      const result = await auctionRepo.findAllActive();
      reply.status(200).send(result);
    });

    fastify.get('/api/auctions/history', { preHandler: [authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
      const user = (request as any).user;
      try {
        const result = await getUserAuctionHistoryUseCase.execute(user.userId);
        reply.status(200).send(result);
      } catch (error: any) {
        reply.status(400).send({ error: error.message });
      }
    });
  };
}
