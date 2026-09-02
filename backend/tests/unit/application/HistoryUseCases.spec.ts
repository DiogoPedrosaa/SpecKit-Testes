import { describe, it, expect, beforeEach } from 'vitest';
import { GetUserAuctionHistoryUseCase } from '../../../src/modules/auctions/application/use-cases/GetUserAuctionHistoryUseCase';
import { IAuctionRepository } from '../../../src/modules/auctions/application/ports/outbound/IAuctionRepository';
import { Auction, AuctionStatus } from '../../../src/modules/auctions/domain/Auction';
import { Bid } from '../../../src/modules/auctions/domain/Bid';

class MockAuctionRepository implements IAuctionRepository {
  public savedAuctions: Auction[] = [];
  public savedBids: Bid[] = [];

  async save(auction: Auction): Promise<void> {
    this.savedAuctions.push(auction);
  }
  async findById(id: string): Promise<Auction | null> {
    return this.savedAuctions.find(a => a.id === id) || null;
  }
  async findActiveByCharacterId(characterId: string): Promise<Auction | null> {
    return null;
  }
  async findActiveExpired(currentDate: Date): Promise<Auction[]> {
    return [];
  }
  async update(auction: Auction): Promise<void> {
    const index = this.savedAuctions.findIndex(a => a.id === auction.id);
    if (index >= 0) {
      this.savedAuctions[index] = auction;
    }
  }
  async findAllActive(): Promise<Auction[]> {
    return [];
  }
  async saveBid(bid: Bid): Promise<void> {
    this.savedBids.push(bid);
  }

  async findAuctionsWonByUserId(userId: string): Promise<Auction[]> {
    return this.savedAuctions.filter(a => a.highestBidderId === userId && a.status === AuctionStatus.FINISHED_SOLD);
  }

  async findAuctionsSoldByUserId(userId: string): Promise<Auction[]> {
    return this.savedAuctions.filter(a => a.sellerId === userId && a.status === AuctionStatus.FINISHED_SOLD);
  }

  async findAuctionsLostByUserId(userId: string): Promise<Auction[]> {
    const biddedAuctionIds = this.savedBids
      .filter(b => b.bidderId === userId)
      .map(b => b.auctionId);
    return this.savedAuctions.filter(a => 
      biddedAuctionIds.includes(a.id) &&
      a.highestBidderId !== userId &&
      (a.status === AuctionStatus.FINISHED_SOLD || a.status === AuctionStatus.FINISHED_NO_BIDS)
    );
  }
}

describe('GetUserAuctionHistoryUseCase', () => {
  let auctionRepository: MockAuctionRepository;
  let useCase: GetUserAuctionHistoryUseCase;

  beforeEach(() => {
    auctionRepository = new MockAuctionRepository();
    useCase = new GetUserAuctionHistoryUseCase(auctionRepository);
  });

  it('should return empty history if user has no activities', async () => {
    const result = await useCase.execute('user-1');
    expect(result).toEqual({ won: [], lost: [], sold: [] });
  });

  it('should return won auctions', async () => {
    const auction = new Auction('a1', 'c1', 'seller-1', 100, new Date(), AuctionStatus.FINISHED_SOLD, 150, 'user-1');
    auctionRepository.savedAuctions.push(auction);

    const result = await useCase.execute('user-1');
    expect(result.won).toHaveLength(1);
    expect(result.won[0].id).toBe('a1');
    expect(result.lost).toHaveLength(0);
    expect(result.sold).toHaveLength(0);
  });

  it('should return lost auctions', async () => {
    const auction = new Auction('a1', 'c1', 'seller-1', 100, new Date(), AuctionStatus.FINISHED_SOLD, 200, 'winner');
    auctionRepository.savedAuctions.push(auction);
    auctionRepository.savedBids.push(new Bid('b1', 'a1', 'user-1', 150, new Date()));

    const result = await useCase.execute('user-1');
    expect(result.lost).toHaveLength(1);
    expect(result.lost[0].id).toBe('a1');
    expect(result.won).toHaveLength(0);
    expect(result.sold).toHaveLength(0);
  });

  it('should return sold auctions', async () => {
    const auction = new Auction('a1', 'c1', 'user-1', 100, new Date(), AuctionStatus.FINISHED_SOLD, 200, 'winner');
    auctionRepository.savedAuctions.push(auction);

    const result = await useCase.execute('user-1');
    expect(result.sold).toHaveLength(1);
    expect(result.sold[0].id).toBe('a1');
    expect(result.won).toHaveLength(0);
    expect(result.lost).toHaveLength(0);
  });
});
