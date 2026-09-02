import { IAuctionRepository } from '../ports/outbound/IAuctionRepository';
import { IUserRepository } from '../../../users/application/ports/outbound/IUserRepository';
import { Bid } from '../../domain/Bid';

export interface PlaceBidDTO {
  auctionId: string;
  bidderId: string;
  amount: number;
}

export class PlaceBidUseCase {
  constructor(
    private readonly auctionRepository: IAuctionRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(dto: PlaceBidDTO): Promise<Bid> {
    const auction = await this.auctionRepository.findById(dto.auctionId);
    if (!auction) {
      throw new Error('Auction not found');
    }

    if (auction.sellerId === dto.bidderId) {
      throw new Error('Seller cannot bid on their own auction');
    }

    const bidder = await this.userRepository.findById(dto.bidderId);
    if (!bidder) {
      throw new Error('User not found');
    }

    // Capture previous highest bidder id before placing the new bid
    const prevBidderId = auction.highestBidderId;
    const prevBidAmount = auction.highestBidAmount;

    // Place the bid on the auction entity
    const bid = auction.placeBid(dto.bidderId, dto.amount, new Date());

    // Reserve balance from the new bidder
    bidder.reserveBalance(dto.amount);
    await this.userRepository.update(bidder);

    // Release balance from the previous bidder
    if (prevBidderId && prevBidAmount !== undefined) {
      const prevBidder = await this.userRepository.findById(prevBidderId);
      if (prevBidder) {
        prevBidder.releaseBalance(prevBidAmount);
        await this.userRepository.update(prevBidder);
      }
    }

    // Persist changes
    await this.auctionRepository.update(auction);
    await this.auctionRepository.saveBid(bid);

    return bid;
  }
}
