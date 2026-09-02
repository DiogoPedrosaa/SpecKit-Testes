import { IAuctionRepository } from '../ports/outbound/IAuctionRepository';
import { Auction } from '../../domain/Auction';

export interface UserAuctionHistoryDto {
  won: Auction[];
  lost: Auction[];
  sold: Auction[];
}

export class GetUserAuctionHistoryUseCase {
  constructor(private readonly auctionRepository: IAuctionRepository) {}

  async execute(userId: string): Promise<UserAuctionHistoryDto> {
    const won = await this.auctionRepository.findAuctionsWonByUserId(userId);
    const lost = await this.auctionRepository.findAuctionsLostByUserId(userId);
    const sold = await this.auctionRepository.findAuctionsSoldByUserId(userId);

    return { won, lost, sold };
  }
}
