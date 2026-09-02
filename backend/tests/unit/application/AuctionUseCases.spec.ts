import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateAuctionUseCase } from '../../../src/modules/auctions/application/use-cases/CreateAuctionUseCase';
import { FinishAuctionsUseCase } from '../../../src/modules/auctions/application/use-cases/FinishAuctionsUseCase';
import { IAuctionRepository } from '../../../src/modules/auctions/application/ports/outbound/IAuctionRepository';
import { ICharacterRepository } from '../../../src/modules/characters/application/ports/outbound/ICharacterRepository';
import { Auction, AuctionStatus } from '../../../src/modules/auctions/domain/Auction';
import { Character } from '../../../src/modules/characters/domain/Character';

describe('Auction Use Cases', () => {
  let auctionRepo: IAuctionRepository;
  let characterRepo: ICharacterRepository;
  let createAuctionUseCase: CreateAuctionUseCase;
  let finishAuctionsUseCase: FinishAuctionsUseCase;

  beforeEach(() => {
    auctionRepo = {
      save: vi.fn(),
      findById: vi.fn(),
      findActiveByCharacterId: vi.fn(),
      findActiveExpired: vi.fn(),
      update: vi.fn(),
      findAllActive: vi.fn(),
    } as unknown as IAuctionRepository;

    characterRepo = {
      findById: vi.fn(),
      save: vi.fn(),
      findByOwnerId: vi.fn(),
      findAll: vi.fn()
    } as unknown as ICharacterRepository;

    createAuctionUseCase = new CreateAuctionUseCase(auctionRepo, characterRepo);
    finishAuctionsUseCase = new FinishAuctionsUseCase(auctionRepo);
  });

  describe('CreateAuctionUseCase', () => {
    it('should create an auction successfully', async () => {
      vi.mocked(characterRepo.findById).mockResolvedValue(new Character('char-1', 'Name', 10, 'Knight', 'seller-1'));
      vi.mocked(auctionRepo.findActiveByCharacterId).mockResolvedValue(null);

      const endTime = new Date(Date.now() + 10000);
      const result = await createAuctionUseCase.execute({
        characterId: 'char-1',
        sellerId: 'seller-1',
        startPrice: 100,
        endTime
      });

      expect(result.id).toBeDefined();
      expect(result.status).toBe(AuctionStatus.ACTIVE);
      expect(auctionRepo.save).toHaveBeenCalledTimes(1);
    });

    it('should throw if character does not exist', async () => {
      vi.mocked(characterRepo.findById).mockResolvedValue(null);

      const endTime = new Date(Date.now() + 10000);
      await expect(createAuctionUseCase.execute({
        characterId: 'char-1',
        sellerId: 'seller-1',
        startPrice: 100,
        endTime
      })).rejects.toThrow('Character not found');
    });

    it('should throw if user is not the owner of character', async () => {
      vi.mocked(characterRepo.findById).mockResolvedValue(new Character('char-1', 'Name', 10, 'Knight', 'seller-2'));

      const endTime = new Date(Date.now() + 10000);
      await expect(createAuctionUseCase.execute({
        characterId: 'char-1',
        sellerId: 'seller-1',
        startPrice: 100,
        endTime
      })).rejects.toThrow('User is not the owner of the character');
    });

    it('should throw if character is already in an active auction', async () => {
      vi.mocked(characterRepo.findById).mockResolvedValue(new Character('char-1', 'Name', 10, 'Knight', 'seller-1'));
      vi.mocked(auctionRepo.findActiveByCharacterId).mockResolvedValue(new Auction('a1', 'char-1', 'seller-1', 100, new Date()));

      const endTime = new Date(Date.now() + 10000);
      await expect(createAuctionUseCase.execute({
        characterId: 'char-1',
        sellerId: 'seller-1',
        startPrice: 100,
        endTime
      })).rejects.toThrow('Character is already in an active auction');
    });
  });

  describe('FinishAuctionsUseCase', () => {
    it('should finish expired active auctions', async () => {
      const a1 = new Auction('a1', 'c1', 's1', 100, new Date(Date.now() - 1000));
      const a2 = new Auction('a2', 'c2', 's2', 200, new Date(Date.now() - 2000), AuctionStatus.ACTIVE, 300, 'b1');
      
      vi.mocked(auctionRepo.findActiveExpired).mockResolvedValue([a1, a2]);

      await finishAuctionsUseCase.execute();

      expect(auctionRepo.findActiveExpired).toHaveBeenCalledTimes(1);
      expect(auctionRepo.update).toHaveBeenCalledTimes(2);
      expect(a1.status).toBe(AuctionStatus.FINISHED_NO_BIDS);
      expect(a2.status).toBe(AuctionStatus.FINISHED_SOLD);
    });
  });
});
