import { FastifyInstance } from 'fastify';
import { MongoAuctionRepository } from '../../modules/auctions/adapters/outbound/MongoAuctionRepository';
import { MongoCharacterRepository } from '../../modules/characters/adapters/outbound/MongoCharacterRepository';
import { MongoUserRepository } from '../../modules/users/adapters/outbound/MongoUserRepository';
import { CreateAuctionUseCase } from '../../modules/auctions/application/use-cases/CreateAuctionUseCase';
import { FinishAuctionsUseCase } from '../../modules/auctions/application/use-cases/FinishAuctionsUseCase';
import { PlaceBidUseCase } from '../../modules/auctions/application/use-cases/PlaceBidUseCase';
import { GetUserAuctionHistoryUseCase } from '../../modules/auctions/application/use-cases/GetUserAuctionHistoryUseCase';
import { auctionController } from '../../modules/auctions/adapters/inbound/auctionController';
import { startAuctionCron } from '../../modules/auctions/adapters/inbound/auctionCron';

export function makeAuctionController() {
  const auctionRepo = new MongoAuctionRepository();
  const characterRepo = new MongoCharacterRepository();
  const userRepo = new MongoUserRepository();
  
  const createAuctionUseCase = new CreateAuctionUseCase(auctionRepo, characterRepo);
  const finishAuctionsUseCase = new FinishAuctionsUseCase(auctionRepo);
  const placeBidUseCase = new PlaceBidUseCase(auctionRepo, userRepo);
  const getUserAuctionHistoryUseCase = new GetUserAuctionHistoryUseCase(auctionRepo);
  
  const plugin = auctionController(createAuctionUseCase, placeBidUseCase, getUserAuctionHistoryUseCase, auctionRepo);

  return async function (app: FastifyInstance) {
    app.register(plugin);

    // start cron running every 10 seconds for testing/MVP purposes
    const cron = startAuctionCron(finishAuctionsUseCase, 10000);
    
    app.addHook('onClose', (instance, done) => {
      cron.stop();
      done();
    });
  };
}
