import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import app from '../../src/app';
import { mongoSetup } from '../../src/main/database/mongoSetup';
import { AuctionStatus } from '../../src/modules/auctions/domain/Auction';
import * as jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';

describe('History Integration', () => {
  const user1Id = randomUUID();
  const user2Id = randomUUID();
  const sellerId = randomUUID();
  let tokenUser1: string;

  beforeAll(async () => {
    await mongoSetup.connect();

    tokenUser1 = jwt.sign({ userId: user1Id }, process.env.JWT_SECRET || 'fallback_secret_key');

    // Create some data
    const db = mongoSetup.db!;
    
    // An auction sold by user1
    await db.collection('auctions').insertOne({
      _id: 'a1', characterId: 'c1', sellerId: user1Id, startPrice: 100,
      endTime: new Date(), status: AuctionStatus.FINISHED_SOLD, highestBidAmount: 200, highestBidderId: user2Id
    });

    // An auction won by user1
    await db.collection('auctions').insertOne({
      _id: 'a2', characterId: 'c2', sellerId: sellerId, startPrice: 100,
      endTime: new Date(), status: AuctionStatus.FINISHED_SOLD, highestBidAmount: 300, highestBidderId: user1Id
    });

    // An auction lost by user1 (user1 placed bid, but user2 won)
    await db.collection('auctions').insertOne({
      _id: 'a3', characterId: 'c3', sellerId: sellerId, startPrice: 100,
      endTime: new Date(), status: AuctionStatus.FINISHED_SOLD, highestBidAmount: 500, highestBidderId: user2Id
    });

    // Bids for a3
    await db.collection('bids').insertMany([
      { _id: 'b1', auctionId: 'a3', bidderId: user1Id, amount: 150, createdAt: new Date() },
      { _id: 'b2', auctionId: 'a3', bidderId: user2Id, amount: 500, createdAt: new Date() }
    ]);
  });

  afterAll(async () => {
    const db = mongoSetup.db!;
    await db.collection('auctions').deleteMany({});
    await db.collection('bids').deleteMany({});
    await mongoSetup.disconnect();
  });

  it('should return user auction history', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/auctions/history',
      headers: {
        authorization: `Bearer ${tokenUser1}`
      }
    });

    expect(response.statusCode).toBe(200);
    const payload = JSON.parse(response.payload);
    
    expect(payload.sold).toHaveLength(1);
    expect(payload.sold[0].id).toBe('a1');

    expect(payload.won).toHaveLength(1);
    expect(payload.won[0].id).toBe('a2');

    expect(payload.lost).toHaveLength(1);
    expect(payload.lost[0].id).toBe('a3');
  });

  it('should return 401 if unauthorized', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/auctions/history',
    });
    expect(response.statusCode).toBe(401);
  });
});
