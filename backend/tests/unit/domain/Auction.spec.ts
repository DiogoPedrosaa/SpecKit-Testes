import { describe, it, expect } from 'vitest';
import { Auction, AuctionStatus } from '../../../src/modules/auctions/domain/Auction';

describe('Auction Entity', () => {
  it('should create an active auction', () => {
    const endTime = new Date(Date.now() + 10000);
    const auction = new Auction(
      'auction-id',
      'char-id',
      'seller-id',
      100,
      endTime
    );

    expect(auction.id).toBe('auction-id');
    expect(auction.characterId).toBe('char-id');
    expect(auction.sellerId).toBe('seller-id');
    expect(auction.startPrice).toBe(100);
    expect(auction.endTime).toBe(endTime);
    expect(auction.status).toBe(AuctionStatus.ACTIVE);
    expect(auction.highestBidAmount).toBeUndefined();
    expect(auction.highestBidderId).toBeUndefined();
  });

  it('should finish auction with no bids', () => {
    const endTime = new Date(Date.now() - 1000);
    const auction = new Auction(
      'auction-id',
      'char-id',
      'seller-id',
      100,
      endTime
    );

    auction.finish();

    expect(auction.status).toBe(AuctionStatus.FINISHED_NO_BIDS);
  });

  it('should finish auction with sold status if there is a bid', () => {
    const endTime = new Date(Date.now() - 1000);
    const auction = new Auction(
      'auction-id',
      'char-id',
      'seller-id',
      100,
      endTime,
      AuctionStatus.ACTIVE,
      150,
      'bidder-id'
    );

    auction.finish();

    expect(auction.status).toBe(AuctionStatus.FINISHED_SOLD);
  });
});
