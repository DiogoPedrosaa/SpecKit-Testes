import { Auction, AuctionStatus } from '../../../domain/Auction';
import { Bid } from '../../../domain/Bid';

export interface IAuctionRepository {
  save(auction: Auction): Promise<void>;
  findById(id: string): Promise<Auction | null>;
  findActiveByCharacterId(characterId: string): Promise<Auction | null>;
  findActiveExpired(currentDate: Date): Promise<Auction[]>;
  update(auction: Auction): Promise<void>;
  findAllActive(): Promise<Auction[]>;
  saveBid(bid: Bid): Promise<void>;
  findAuctionsWonByUserId(userId: string): Promise<Auction[]>;
  findAuctionsLostByUserId(userId: string): Promise<Auction[]>;
  findAuctionsSoldByUserId(userId: string): Promise<Auction[]>;
}
