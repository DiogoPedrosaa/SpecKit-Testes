import { describe, it, expect } from 'vitest';
import { Auction, AuctionStatus } from '../../../src/modules/auctions/domain/Auction';
import { Bid } from '../../../src/modules/auctions/domain/Bid';

describe('Auction Bid Rules (Domain)', () => {
  it('should accept a valid first bid', () => {
    const auction = new Auction('auc1', 'char1', 'seller1', 100, new Date(Date.now() + 10000));
    const now = new Date();
    const bid = auction.placeBid('bidder1', 100, now);

    expect(bid).toBeInstanceOf(Bid);
    expect(bid.amount).toBe(100);
    expect(bid.bidderId).toBe('bidder1');
    expect(auction.highestBidAmount).toBe(100);
    expect(auction.highestBidderId).toBe('bidder1');
  });

  it('should reject a bid lower than start price if there are no bids', () => {
    const auction = new Auction('auc1', 'char1', 'seller1', 100, new Date(Date.now() + 10000));
    const now = new Date();
    expect(() => auction.placeBid('bidder1', 99, now)).toThrow('Bid amount must be at least the start price or higher than the current highest bid');
  });

  it('should accept a bid higher than current highest bid', () => {
    const auction = new Auction('auc1', 'char1', 'seller1', 100, new Date(Date.now() + 10000));
    const now = new Date();
    auction.placeBid('bidder1', 100, now);
    const bid = auction.placeBid('bidder2', 105, now);

    expect(bid.bidderId).toBe('bidder2');
    expect(bid.amount).toBe(105);
    expect(auction.highestBidAmount).toBe(105);
    expect(auction.highestBidderId).toBe('bidder2');
  });

  it('should reject a bid equal or lower than current highest bid', () => {
    const auction = new Auction('auc1', 'char1', 'seller1', 100, new Date(Date.now() + 10000));
    const now = new Date();
    auction.placeBid('bidder1', 100, now);
    
    expect(() => auction.placeBid('bidder2', 100, now)).toThrow('Bid amount must be at least the start price or higher than the current highest bid');
    expect(() => auction.placeBid('bidder3', 95, now)).toThrow('Bid amount must be at least the start price or higher than the current highest bid');
  });

  it('should reject a bid if auction is not ACTIVE', () => {
    const auction = new Auction('auc1', 'char1', 'seller1', 100, new Date(Date.now() + 10000), AuctionStatus.FINISHED_NO_BIDS);
    const now = new Date();
    expect(() => auction.placeBid('bidder1', 100, now)).toThrow('Cannot place bid on an inactive auction');
  });

  it('should reject a bid if auction has ended', () => {
    const auction = new Auction('auc1', 'char1', 'seller1', 100, new Date(Date.now() - 10000)); // already ended
    const now = new Date();
    expect(() => auction.placeBid('bidder1', 100, now)).toThrow('Cannot place bid on an ended auction');
  });
});
