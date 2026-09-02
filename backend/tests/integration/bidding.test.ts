import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import app from '../../src/app';
import { mongoSetup } from '../../src/main/database/mongoSetup';

let sellerToken: string;
let bidderToken: string;
let bidder2Token: string;
let auctionId: string;
let characterId: string;

beforeAll(async () => {
  await mongoSetup.connect();
  
  if (mongoSetup.db) {
    await mongoSetup.db.collection('users').deleteMany({});
    await mongoSetup.db.collection('characters').deleteMany({});
    await mongoSetup.db.collection('auctions').deleteMany({});
    await mongoSetup.db.collection('bids').deleteMany({});
  }

  // Seller
  const sellerRes = await app.inject({
    method: 'POST',
    url: '/api/auth/register',
    payload: { name: 'Seller', email: 'seller@test.com', password: '123' }
  });
  sellerToken = JSON.parse(sellerRes.body).token;

  // Bidder 1
  const bidderRes = await app.inject({
    method: 'POST',
    url: '/api/auth/register',
    payload: { name: 'Bidder', email: 'bidder@test.com', password: '123' }
  });
  bidderToken = JSON.parse(bidderRes.body).token;

  // Bidder 2
  const bidder2Res = await app.inject({
    method: 'POST',
    url: '/api/auth/register',
    payload: { name: 'Bidder 2', email: 'bidder2@test.com', password: '123' }
  });
  bidder2Token = JSON.parse(bidder2Res.body).token;

  // Add balance to bidders (Assuming we have a way to do this or they start with 1000)
  // Need to give balance? In Auth Use Cases we see standard balance is 0?
  // Let me manually update balance in DB for testing
  if (mongoSetup.db) {
    await mongoSetup.db.collection('users').updateMany(
      { email: { $in: ['bidder@test.com', 'bidder2@test.com'] } },
      { $set: { freeBalance: 1000 } }
    );
  }

  // Create character
  const charRes = await app.inject({
    method: 'POST',
    url: '/api/characters',
    headers: { authorization: `Bearer ${sellerToken}` },
    payload: { name: 'AuctionHero', level: 100, vocation: 'Sorcerer' }
  });
  characterId = JSON.parse(charRes.body).id;

  // Create auction
  const endTime = new Date(Date.now() + 100000).toISOString();
  const auctionRes = await app.inject({
    method: 'POST',
    url: '/api/auctions',
    headers: { authorization: `Bearer ${sellerToken}` },
    payload: { characterId, startPrice: 100, endTime }
  });
  auctionId = JSON.parse(auctionRes.body).id;
});

afterAll(async () => {
  await app.close();
});

describe('Bidding API Integration', () => {
  it('should place a bid successfully', async () => {
    const response = await app.inject({
      method: 'POST',
      url: `/api/auctions/${auctionId}/bids`,
      headers: { authorization: `Bearer ${bidderToken}` },
      payload: { amount: 150 }
    });

    expect(response.statusCode).toBe(201);
    const body = JSON.parse(response.body);
    expect(body.amount).toBe(150);
    expect(body.auctionId).toBe(auctionId);
  });

  it('should not allow placing a bid lower than highest bid', async () => {
    const response = await app.inject({
      method: 'POST',
      url: `/api/auctions/${auctionId}/bids`,
      headers: { authorization: `Bearer ${bidder2Token}` },
      payload: { amount: 100 }
    });

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.body);
    expect(body.error).toBe('Bid amount must be at least the start price or higher than the current highest bid');
  });

  it('should update highest bidder and release previous bidder balance', async () => {
    const response = await app.inject({
      method: 'POST',
      url: `/api/auctions/${auctionId}/bids`,
      headers: { authorization: `Bearer ${bidder2Token}` },
      payload: { amount: 200 }
    });

    expect(response.statusCode).toBe(201);
    
    // Check bidder 1 balance
    const meRes = await app.inject({
      method: 'GET',
      url: '/api/auth/me',
      headers: { authorization: `Bearer ${bidderToken}` }
    });
    const meBody = JSON.parse(meRes.body);
    expect(meBody.freeBalance).toBe(1000); // released
    expect(meBody.lockedBalance).toBe(0);

    // Check bidder 2 balance
    const me2Res = await app.inject({
      method: 'GET',
      url: '/api/auth/me',
      headers: { authorization: `Bearer ${bidder2Token}` }
    });
    const me2Body = JSON.parse(me2Res.body);
    expect(me2Body.freeBalance).toBe(800); // 1000 - 200
    expect(me2Body.lockedBalance).toBe(200);
  });
});
