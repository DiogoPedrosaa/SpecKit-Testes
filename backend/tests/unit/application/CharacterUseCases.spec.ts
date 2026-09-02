import { describe, it, expect, beforeEach } from 'vitest';
import { CreateCharacterUseCase } from '../../../src/modules/characters/application/use-cases/CreateCharacterUseCase';
import { ListCharactersUseCase } from '../../../src/modules/characters/application/use-cases/ListCharactersUseCase';
import { ICharacterRepository } from '../../../src/modules/characters/application/ports/outbound/ICharacterRepository';
import { Character } from '../../../src/modules/characters/domain/Character';

class MockCharacterRepository implements ICharacterRepository {
  private characters: Character[] = [];

  async save(character: Character): Promise<void> {
    this.characters.push(character);
  }

  async findByOwnerId(ownerId: string): Promise<Character[]> {
    return this.characters.filter(c => c.ownerId === ownerId);
  }

  async findAll(): Promise<Character[]> {
    return this.characters;
  }
}

describe('Character Use Cases', () => {
  let characterRepository: MockCharacterRepository;

  beforeEach(() => {
    characterRepository = new MockCharacterRepository();
  });

  describe('CreateCharacterUseCase', () => {
    it('should create a character', async () => {
      // Arrange
      const createCharacterUseCase = new CreateCharacterUseCase(characterRepository);
      const input = {
        name: 'Hero',
        level: 100,
        vocation: 'Knight',
        ownerId: 'user-1'
      };

      // Act
      const result = await createCharacterUseCase.execute(input);

      // Assert
      expect(result.id).toBeDefined();
      expect(result.name).toBe('Hero');
      expect(result.level).toBe(100);
      expect(result.vocation).toBe('Knight');
      expect(result.ownerId).toBe('user-1');

      const savedCharacters = await characterRepository.findAll();
      expect(savedCharacters.length).toBe(1);
      expect(savedCharacters[0].name).toBe('Hero');
    });
  });

  describe('ListCharactersUseCase', () => {
    it('should list characters for a given owner', async () => {
      // Arrange
      const listCharactersUseCase = new ListCharactersUseCase(characterRepository);
      await characterRepository.save(new Character('1', 'Hero', 100, 'Knight', 'user-1'));
      await characterRepository.save(new Character('2', 'Mage', 50, 'Sorcerer', 'user-2'));

      // Act
      const results = await listCharactersUseCase.execute({ ownerId: 'user-1' });

      // Assert
      expect(results.length).toBe(1);
      expect(results[0].name).toBe('Hero');
    });

    it('should list all characters when no ownerId is provided', async () => {
      // Arrange
      const listCharactersUseCase = new ListCharactersUseCase(characterRepository);
      await characterRepository.save(new Character('1', 'Hero', 100, 'Knight', 'user-1'));
      await characterRepository.save(new Character('2', 'Mage', 50, 'Sorcerer', 'user-2'));

      // Act
      const results = await listCharactersUseCase.execute({});

      // Assert
      expect(results.length).toBe(2);
    });
  });
});
