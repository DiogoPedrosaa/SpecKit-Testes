import { ICharacterRepository } from '../../application/ports/outbound/ICharacterRepository';
import { Character } from '../../domain/Character';
import { mongoSetup } from '../../../../main/database/mongoSetup';

export class MongoCharacterRepository implements ICharacterRepository {
  private get collection() {
    if (!mongoSetup.db) throw new Error('Database not initialized');
    return mongoSetup.db.collection('characters');
  }

  async save(character: Character): Promise<void> {
    const doc = {
      _id: character.id,
      name: character.name,
      level: character.level,
      vocation: character.vocation,
      ownerId: character.ownerId
    };
    await this.collection.updateOne(
      { _id: character.id },
      { $set: doc },
      { upsert: true }
    );
  }

  private mapDocToCharacter(doc: any): Character {
    return new Character(
      doc._id.toString(),
      doc.name,
      doc.level,
      doc.vocation,
      doc.ownerId
    );
  }

  async findByOwnerId(ownerId: string): Promise<Character[]> {
    const docs = await this.collection.find({ ownerId }).toArray();
    return docs.map(doc => this.mapDocToCharacter(doc));
  }

  async findAll(): Promise<Character[]> {
    const docs = await this.collection.find({}).toArray();
    return docs.map(doc => this.mapDocToCharacter(doc));
  }

  async findById(id: string): Promise<Character | null> {
    const doc = await this.collection.findOne({ _id: id });
    if (!doc) return null;
    return this.mapDocToCharacter(doc);
  }
}
