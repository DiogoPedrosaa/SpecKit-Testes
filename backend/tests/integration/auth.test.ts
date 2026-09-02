import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import app from '../../src/app'
import { mongoSetup } from '../../src/main/database/mongoSetup'

beforeAll(async () => {
  await mongoSetup.connect()
})

afterAll(async () => {
  await app.close()
})

describe('Auth API Integration', () => {
  it('should register a new user', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/auth/register',
      payload: {
        name: 'Integration',
        email: 'int@int.com',
        password: '123'
      }
    })

    expect(response.statusCode).toBe(201)
    const body = JSON.parse(response.body)
    expect(body.token).toBeDefined()
    expect(body.user.name).toBe('Integration')
  })
})
