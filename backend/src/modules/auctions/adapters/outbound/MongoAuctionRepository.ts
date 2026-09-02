import { IAuctionRepository } from '../../application/ports/outbound/IAuctionRepository';
import { Auction, AuctionStatus } from '../../domain/Auction';
import { Bid } from '../../domain/Bid';
import { mongoSetup } from '../../../../main/database/mongoSetup';

export class MongoAuctionRepository implements IAuctionRepository {
  private get collection() {
    if (!mongoSetup.db) throw new Error('Database not initialized');
    return mongoSetup.db.collection('auctions');
  }

  private get bidsCollection() {
    if (!mongoSetup.db) throw new Error('Database not initialized');
    return mongoSetup.db.collection('bids');
  }

  async save(auction: Auction): Promise<void> {
    const doc = {
      _id: auction.id,
      characterId: auction.characterId,
      sellerId: auction.sellerId,
      startPrice: auction.startPrice,
      endTime: auction.endTime,
      status: auction.status,
      highestBidAmount: auction.highestBidAmount,
      highestBidderId: auction.highestBidderId
    };
    await this.collection.updateOne(
      { _id: auction.id },
      { $set: doc },
      { upsert: true }
    );
  }

  async findById(id: string): Promise<Auction | null> {
    const doc = await this.collection.findOne({ _id: id });
    if (!doc) return null;
    return this.mapDocToAuction(doc);
  }

  async findActiveByCharacterId(characterId: string): Promise<Auction | null> {
    const doc = await this.collection.findOne({ characterId, status: AuctionStatus.ACTIVE });
    if (!doc) return null;
    return this.mapDocToAuction(doc);
  }

  async findActiveExpired(currentDate: Date): Promise<Auction[]> {
    const docs = await this.collection.find({
      status: AuctionStatus.ACTIVE,
      endTime: { $lt: currentDate }
    }).toArray();
    
    return docs.map(doc => this.mapDocToAuction(doc));
  }

  async update(auction: Auction): Promise<void> {
    await this.save(auction);
  }

  async findAllActive(): Promise<Auction[]> {
    const docs = await this.collection.find({ status: AuctionStatus.ACTIVE }).toArray();
    
    return docs.map(doc => this.mapDocToAuction(doc));
  }

  async saveBid(bid: Bid): Promise<void> {
    const doc = {
      _id: bid.id,
      auctionId: bid.auctionId,
      bidderId: bid.bidderId,
      amount: bid.amount,
      createdAt: bid.createdAt
    };
    await this.bidsCollection.insertOne(doc);
  }

  private mapDocToAuction(doc: any): Auction {
    return new Auction(
      doc._id.toString(),
      doc.characterId,
      doc.sellerId,
      doc.startPrice,
      doc.endTime,
      doc.status as AuctionStatus,
      doc.highestBidAmount,
      doc.highestBidderId
    );
  }

  async findAuctionsWonByUserId(userId: string): Promise<Auction[]> {
    const docs = await this.collection.find({
      highestBidderId: userId,
      status: AuctionStatus.FINISHED_SOLD
    }).toArray();
    return docs.map(doc => this.mapDocToAuction(doc));
  }

  async findAuctionsSoldByUserId(userId: string): Promise<Auction[]> {
    const docs = await this.collection.find({
      sellerId: userId,
      status: AuctionStatus.FINISHED_SOLD
    }).toArray();
    return docs.map(doc => this.mapDocToAuction(doc));
  }

  async findAuctionsLostByUserId(userId: string): Promise<Auction[]> {
    // Find all distinct auctionIds where user placed a bid
    const userBids = await this.bidsCollection.find({ bidderId: userId }).toArray();
    const auctionIds = Array.from(new Set(userBids.map(b => b.auctionId)));

    // Find those auctions where status is finished but highestBidder is not user
    const docs = await this.collection.find({
      _id: { $in: auctionIds },
      highestBidderId: { $ne: userId },
      status: { $in: [AuctionStatus.FINISHED_SOLD, AuctionStatus.FINISHED_NO_BIDS] }
    }).toArray();
    return docs.map(doc => this.mapDocToAuction(doc));
  }
}
