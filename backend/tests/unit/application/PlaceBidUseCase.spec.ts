import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PlaceBidUseCase, PlaceBidDTO } from '../../../src/modules/auctions/application/use-cases/PlaceBidUseCase';
import { IAuctionRepository } from '../../../src/modules/auctions/application/ports/outbound/IAuctionRepository';
import { IUserRepository } from '../../../src/modules/users/application/ports/outbound/IUserRepository';
import { Auction, AuctionStatus } from '../../../src/modules/auctions/domain/Auction';
import { User } from '../../../src/modules/users/domain/User';

describe('PlaceBidUseCase', () => {
  let auctionRepo: IAuctionRepository;
  let userRepo: IUserRepository;
  let useCase: PlaceBidUseCase;

  beforeEach(() => {
    auctionRepo = {
      save: vi.fn(),
      findById: vi.fn(),
      findActiveByCharacterId: vi.fn(),
      findActiveExpired: vi.fn(),
      update: vi.fn(),
      findAllActive: vi.fn(),
      saveBid: vi.fn(),
    };

    userRepo = {
      save: vi.fn(),
      findById: vi.fn(),
      findByEmail: vi.fn(),
      update: vi.fn()
    };

    useCase = new PlaceBidUseCase(auctionRepo, userRepo);
  });

  it('should place a bid successfully and reserve balance', async () => {
    const auction = new Auction('auc1', 'char1', 'seller1', 100, new Date(Date.now() + 10000));
    const bidder = new User('bidder1', 'Bidder', 'bidder@test.com', 'hash', 200, 0);

    vi.mocked(auctionRepo.findById).mockResolvedValue(auction);
    vi.mocked(userRepo.findById).mockResolvedValue(bidder);

    const dto: PlaceBidDTO = {
      auctionId: 'auc1',
      bidderId: 'bidder1',
      amount: 150
    };

    const bid = await useCase.execute(dto);

    expect(bid.amount).toBe(150);
    expect(bid.bidderId).toBe('bidder1');
    expect(bidder.freeBalance).toBe(50);
    expect(bidder.lockedBalance).toBe(150);
    expect(userRepo.update).toHaveBeenCalledWith(bidder);
    expect(auctionRepo.update).toHaveBeenCalledWith(auction);
    expect(auctionRepo.saveBid).toHaveBeenCalled();
  });

  it('should release balance from previous bidder when overbid', async () => {
    const auction = new Auction('auc1', 'char1', 'seller1', 100, new Date(Date.now() + 10000), AuctionStatus.ACTIVE, 150, 'prevBidder');
    const newBidder = new User('newBidder', 'New Bidder', 'new@test.com', 'hash', 300, 0);
    const prevBidder = new User('prevBidder', 'Prev Bidder', 'prev@test.com', 'hash', 0, 150);

    vi.mocked(auctionRepo.findById).mockResolvedValue(auction);
    vi.mocked(userRepo.findById).mockImplementation(async (id) => {
      if (id === 'newBidder') return newBidder;
      if (id === 'prevBidder') return prevBidder;
      return null;
    });

    const dto: PlaceBidDTO = {
      auctionId: 'auc1',
      bidderId: 'newBidder',
      amount: 200
    };

    await useCase.execute(dto);

    // New bidder balance reserved
    expect(newBidder.freeBalance).toBe(100);
    expect(newBidder.lockedBalance).toBe(200);

    // Prev bidder balance released
    expect(prevBidder.freeBalance).toBe(150);
    expect(prevBidder.lockedBalance).toBe(0);

    expect(userRepo.update).toHaveBeenCalledWith(newBidder);
    expect(userRepo.update).toHaveBeenCalledWith(prevBidder);
  });

  it('should throw error if auction not found', async () => {
    vi.mocked(auctionRepo.findById).mockResolvedValue(null);

    const dto = { auctionId: 'auc1', bidderId: 'bidder1', amount: 150 };
    await expect(useCase.execute(dto)).rejects.toThrow('Auction not found');
  });

  it('should throw error if user not found', async () => {
    const auction = new Auction('auc1', 'char1', 'seller1', 100, new Date(Date.now() + 10000));
    vi.mocked(auctionRepo.findById).mockResolvedValue(auction);
    vi.mocked(userRepo.findById).mockResolvedValue(null);

    const dto = { auctionId: 'auc1', bidderId: 'bidder1', amount: 150 };
    await expect(useCase.execute(dto)).rejects.toThrow('User not found');
  });

  it('should throw error if bidder is seller', async () => {
    const auction = new Auction('auc1', 'char1', 'seller1', 100, new Date(Date.now() + 10000));
    const bidder = new User('seller1', 'Seller', 'seller@test.com', 'hash', 200, 0);

    vi.mocked(auctionRepo.findById).mockResolvedValue(auction);
    vi.mocked(userRepo.findById).mockResolvedValue(bidder);

    const dto = { auctionId: 'auc1', bidderId: 'seller1', amount: 150 };
    await expect(useCase.execute(dto)).rejects.toThrow('Seller cannot bid on their own auction');
  });
});
