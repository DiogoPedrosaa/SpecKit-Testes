import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import app from '../../src/app';
import { mongoSetup } from '../../src/main/database/mongoSetup';

let token: string;
let characterId: string;

beforeAll(async () => {
  await mongoSetup.connect();
  
  if (mongoSetup.db) {
    await mongoSetup.db.collection('users').deleteMany({});
    await mongoSetup.db.collection('characters').deleteMany({});
    await mongoSetup.db.collection('auctions').deleteMany({});
  }

  const response = await app.inject({
    method: 'POST',
    url: '/api/auth/register',
    payload: {
      name: 'Auction Tester',
      email: 'auction@tester.com',
      password: '123'
    }
  });

  const body = JSON.parse(response.body);
  token = body.token;

  // Create a character to test auctions
  const charRes = await app.inject({
    method: 'POST',
    url: '/api/characters',
    headers: {
      authorization: `Bearer ${token}`
    },
    payload: {
      name: 'AuctionHero',
      level: 100,
      vocation: 'Sorcerer'
    }
  });
  
  const charBody = JSON.parse(charRes.body);
  characterId = charBody.id;
});

afterAll(async () => {
  await app.close();
});

describe('Auctions API Integration', () => {
  it('should create an auction', async () => {
    const endTime = new Date(Date.now() + 100000).toISOString();
    
    const response = await app.inject({
      method: 'POST',
      url: '/api/auctions',
      headers: {
        authorization: `Bearer ${token}`
      },
      payload: {
        characterId,
        startPrice: 100,
        endTime
      }
    });

    expect(response.statusCode).toBe(201);
    const body = JSON.parse(response.body);
    expect(body.id).toBeDefined();
    expect(body.characterId).toBe(characterId);
    expect(body.startPrice).toBe(100);
    expect(body.status).toBe('ACTIVE');
  });

  it('should not allow creating another active auction for the same character', async () => {
    const endTime = new Date(Date.now() + 100000).toISOString();
    
    const response = await app.inject({
      method: 'POST',
      url: '/api/auctions',
      headers: {
        authorization: `Bearer ${token}`
      },
      payload: {
        characterId,
        startPrice: 200,
        endTime
      }
    });

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.body);
    expect(body.error).toBe('Character is already in an active auction');
  });

  it('should list active auctions', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/auctions'
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.length).toBeGreaterThanOrEqual(1);
    expect(body[0].characterId).toBe(characterId);
    expect(body[0].status).toBe('ACTIVE');
  });
});
