import { IUserRepository } from '../../application/ports/outbound/IUserRepository';
import { User } from '../../domain/User';
import { mongoSetup } from '../../../../main/database/mongoSetup';

export class MongoUserRepository implements IUserRepository {
  private get collection() {
    if (!mongoSetup.db) throw new Error('Database not initialized');
    return mongoSetup.db.collection('users');
  }

  private mapDocToUser(doc: any): User {
    return new User(
      doc._id.toString(),
      doc.name,
      doc.email,
      doc.passwordHash,
      doc.freeBalance,
      doc.lockedBalance
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await this.collection.findOne({ email });
    if (!doc) return null;
    return this.mapDocToUser(doc);
  }

  async findById(id: string): Promise<User | null> {
    const doc = await this.collection.findOne({ _id: id });
    if (!doc) return null;
    return this.mapDocToUser(doc);
  }

  async save(user: User): Promise<void> {
    const doc = {
      _id: user.id,
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      freeBalance: user.freeBalance,
      lockedBalance: user.lockedBalance
    };
    await this.collection.updateOne(
      { _id: user.id },
      { $set: doc },
      { upsert: true }
    );
  }
}
