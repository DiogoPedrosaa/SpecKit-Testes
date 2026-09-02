import { describe, it, expect } from 'vitest'
import { User, InsufficientBalanceError } from '../../../src/modules/users/domain/User'

describe('User Entity', () => {
  it('should create a user with 0 balance', () => {
    const user = new User('1', 'Test', 'test@test.com', 'hash')
    expect(user.freeBalance).toBe(0)
    expect(user.lockedBalance).toBe(0)
  })

  it('should add free balance', () => {
    const user = new User('1', 'Test', 'test@test.com', 'hash')
    user.addFreeBalance(1000)
    expect(user.freeBalance).toBe(1000)
  })

  it('should reserve balance and move to locked', () => {
    const user = new User('1', 'Test', 'test@test.com', 'hash', 1000, 0)
    user.reserveBalance(400)
    expect(user.freeBalance).toBe(600)
    expect(user.lockedBalance).toBe(400)
  })

  it('should throw when reserving more than free balance', () => {
    const user = new User('1', 'Test', 'test@test.com', 'hash', 100, 0)
    expect(() => user.reserveBalance(200)).toThrow(InsufficientBalanceError)
  })

  it('should release locked balance back to free balance', () => {
    const user = new User('1', 'Test', 'test@test.com', 'hash', 600, 400)
    user.releaseBalance(400)
    expect(user.freeBalance).toBe(1000)
    expect(user.lockedBalance).toBe(0)
  })

  it('should deduct locked balance', () => {
    const user = new User('1', 'Test', 'test@test.com', 'hash', 600, 400)
    user.deductLockedBalance(400)
    expect(user.freeBalance).toBe(600)
    expect(user.lockedBalance).toBe(0)
  })
})
