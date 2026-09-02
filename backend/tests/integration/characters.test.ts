import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import app from '../../src/app';
import { mongoSetup } from '../../src/main/database/mongoSetup';

let token: string;

beforeAll(async () => {
  await mongoSetup.connect();
  
  if (mongoSetup.db) {
    await mongoSetup.db.collection('users').deleteMany({});
    await mongoSetup.db.collection('characters').deleteMany({});
  }

  const response = await app.inject({
    method: 'POST',
    url: '/api/auth/register',
    payload: {
      name: 'Char Tester',
      email: 'char@tester.com',
      password: '123'
    }
  });

  const body = JSON.parse(response.body);
  token = body.token;
});

afterAll(async () => {
  await app.close();
});

describe('Characters API Integration', () => {
  it('should create a character', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/characters',
      headers: {
        authorization: `Bearer ${token}`
      },
      payload: {
        name: 'MyHero',
        level: 50,
        vocation: 'Druid'
      }
    });

    expect(response.statusCode).toBe(201);
    const body = JSON.parse(response.body);
    expect(body.id).toBeDefined();
    expect(body.name).toBe('MyHero');
    expect(body.ownerId).toBeDefined();
  });

  it('should list all characters for the logged user', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/characters/me',
      headers: {
        authorization: `Bearer ${token}`
      }
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.length).toBeGreaterThanOrEqual(1);
    expect(body[0].name).toBe('MyHero');
  });

  it('should list all characters publicly', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/characters'
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.length).toBeGreaterThanOrEqual(1);
    expect(body[0].name).toBe('MyHero');
  });
});
