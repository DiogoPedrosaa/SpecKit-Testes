import { IAuctionRepository } from '../ports/outbound/IAuctionRepository';

export class FinishAuctionsUseCase {
  constructor(private readonly auctionRepo: IAuctionRepository) {}

  async execute(): Promise<void> {
    const now = new Date();
    const expiredAuctions = await this.auctionRepo.findActiveExpired(now);

    for (const auction of expiredAuctions) {
      auction.finish();
      await this.auctionRepo.update(auction);
    }
  }
}
