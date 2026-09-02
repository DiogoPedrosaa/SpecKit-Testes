import { describe, it, expect, vi } from 'vitest'
import { RegisterUserUseCase } from '../../../src/modules/users/application/use-cases/RegisterUserUseCase'
import { LoginUserUseCase } from '../../../src/modules/users/application/use-cases/LoginUserUseCase'
import { AddBalanceUseCase } from '../../../src/modules/users/application/use-cases/AddBalanceUseCase'
import { IUserRepository } from '../../../src/modules/users/application/ports/outbound/IUserRepository'
import { IHasherPort } from '../../../src/modules/users/application/ports/outbound/IHasherPort'
import { ITokenPort } from '../../../src/modules/users/application/ports/outbound/ITokenPort'
import { User } from '../../../src/modules/users/domain/User'

const mockUserRepository: IUserRepository = {
  findByEmail: vi.fn(),
  findById: vi.fn(),
  save: vi.fn(),
}

const mockHasher: IHasherPort = {
  hash: vi.fn().mockResolvedValue('hashed_password'),
  compare: vi.fn(),
}

const mockTokenPort: ITokenPort = {
  sign: vi.fn().mockReturnValue('mock_token'),
  verify: vi.fn(),
}

describe('Auth Use Cases', () => {
  describe('RegisterUserUseCase', () => {
    it('should register a new user successfully', async () => {
      vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null)
      const useCase = new RegisterUserUseCase(mockUserRepository, mockHasher, mockTokenPort)
      
      const result = await useCase.execute({ name: 'Test', email: 'test@test.com', password: '123' })
      expect(result.token).toBe('mock_token')
      expect(result.user.name).toBe('Test')
      expect(mockUserRepository.save).toHaveBeenCalled()
    })

    it('should throw if email already exists', async () => {
      vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(new User('1', 'T', 'test@test.com', 'h'))
      const useCase = new RegisterUserUseCase(mockUserRepository, mockHasher, mockTokenPort)
      
      await expect(useCase.execute({ name: 'Test', email: 'test@test.com', password: '123' }))
        .rejects.toThrow('Email already exists')
    })
  })

  describe('LoginUserUseCase', () => {
    it('should login and return a token', async () => {
      const user = new User('1', 'T', 'test@test.com', 'hashed')
      vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(user)
      vi.mocked(mockHasher.compare).mockResolvedValue(true)

      const useCase = new LoginUserUseCase(mockUserRepository, mockHasher, mockTokenPort)
      const result = await useCase.execute({ email: 'test@test.com', password: '123' })
      
      expect(result.token).toBe('mock_token')
    })

    it('should throw on invalid credentials', async () => {
      vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null)
      const useCase = new LoginUserUseCase(mockUserRepository, mockHasher, mockTokenPort)
      
      await expect(useCase.execute({ email: 'test@test.com', password: '123' }))
        .rejects.toThrow('Invalid credentials')
    })
  })

  describe('AddBalanceUseCase', () => {
    it('should add balance to an existing user', async () => {
      const user = new User('1', 'T', 'test@test.com', 'hashed')
      vi.mocked(mockUserRepository.findById).mockResolvedValue(user)

      const useCase = new AddBalanceUseCase(mockUserRepository)
      const result = await useCase.execute({ userId: '1', amount: 1000 })
      
      expect(result.freeBalance).toBe(1000)
      expect(mockUserRepository.save).toHaveBeenCalledWith(user)
    })
  })
})
