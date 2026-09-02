import { Bid } from './Bid';
import { randomUUID } from 'crypto';

export enum AuctionStatus {
  ACTIVE = 'ACTIVE',
  FINISHED_SOLD = 'FINISHED_SOLD',
  FINISHED_NO_BIDS = 'FINISHED_NO_BIDS',
  CANCELLED = 'CANCELLED'
}

export class Auction {
  constructor(
    public readonly id: string,
    public readonly characterId: string,
    public readonly sellerId: string,
    public readonly startPrice: number,
    public readonly endTime: Date,
    public status: AuctionStatus = AuctionStatus.ACTIVE,
    public highestBidAmount?: number,
    public highestBidderId?: string
  ) {}

  finish(): void {
    if (this.highestBidderId && this.highestBidAmount) {
      this.status = AuctionStatus.FINISHED_SOLD;
    } else {
      this.status = AuctionStatus.FINISHED_NO_BIDS;
    }
  }

  placeBid(bidderId: string, amount: number, now: Date): Bid {
    if (now >= this.endTime) throw new Error('Cannot place bid on an ended auction');
    if (this.status !== AuctionStatus.ACTIVE) throw new Error('Cannot place bid on an inactive auction');
    
    if (this.highestBidAmount !== undefined) {
      if (amount <= this.highestBidAmount) {
        throw new Error('Bid amount must be at least the start price or higher than the current highest bid');
      }
    } else {
      if (amount < this.startPrice) {
        throw new Error('Bid amount must be at least the start price or higher than the current highest bid');
      }
    }

    this.highestBidAmount = amount;
    this.highestBidderId = bidderId;

    return new Bid(randomUUID(), this.id, bidderId, amount, now);
  }
}
