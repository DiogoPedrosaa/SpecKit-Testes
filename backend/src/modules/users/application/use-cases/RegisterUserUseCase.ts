import { IUserRepository } from '../ports/outbound/IUserRepository';
import { IHasherPort } from '../ports/outbound/IHasherPort';
import { ITokenPort } from '../ports/outbound/ITokenPort';
import { User } from '../../domain/User';
import { randomUUID } from 'crypto';

export class RegisterUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private hasher: IHasherPort,
    private tokenPort: ITokenPort
  ) {}

  async execute(input: any): Promise<{ user: User; token: string }> {
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) {
      throw new Error('Email already exists');
    }

    const hashedPassword = await this.hasher.hash(input.password);
    const id = randomUUID();
    const user = new User(id, input.name, input.email, hashedPassword);
    
    await this.userRepository.save(user);

    const token = this.tokenPort.sign({ userId: user.id });

    return { user, token };
  }
}
