import { IAuctionRepository } from '../ports/outbound/IAuctionRepository';
import { ICharacterRepository } from '../../../characters/application/ports/outbound/ICharacterRepository';
import { Auction } from '../../domain/Auction';
import { randomUUID } from 'crypto';

interface CreateAuctionDTO {
  characterId: string;
  sellerId: string;
  startPrice: number;
  endTime: Date;
}

export class CreateAuctionUseCase {
  constructor(
    private readonly auctionRepo: IAuctionRepository,
    private readonly characterRepo: ICharacterRepository
  ) {}

  async execute(dto: CreateAuctionDTO): Promise<Auction> {
    const character = await this.characterRepo.findById(dto.characterId);
    if (!character) {
      throw new Error('Character not found');
    }

    if (character.ownerId !== dto.sellerId) {
      throw new Error('User is not the owner of the character');
    }

    const activeAuction = await this.auctionRepo.findActiveByCharacterId(dto.characterId);
    if (activeAuction) {
      throw new Error('Character is already in an active auction');
    }

    const auction = new Auction(
      randomUUID(),
      dto.characterId,
      dto.sellerId,
      dto.startPrice,
      dto.endTime
    );

    await this.auctionRepo.save(auction);
    return auction;
  }
}
