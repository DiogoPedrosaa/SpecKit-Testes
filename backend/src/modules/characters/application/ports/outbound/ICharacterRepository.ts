import { Character } from '../../../domain/Character';

export interface ICharacterRepository {
  save(character: Character): Promise<void>;
  findByOwnerId(ownerId: string): Promise<Character[]>;
  findAll(): Promise<Character[]>;
  findById(id: string): Promise<Character | null>;
}
