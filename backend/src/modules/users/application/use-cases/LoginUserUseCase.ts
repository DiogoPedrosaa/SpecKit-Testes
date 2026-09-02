import { IUserRepository } from '../ports/outbound/IUserRepository';
import { IHasherPort } from '../ports/outbound/IHasherPort';
import { ITokenPort } from '../ports/outbound/ITokenPort';
import { User } from '../../domain/User';

export class LoginUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private hasher: IHasherPort,
    private tokenPort: ITokenPort
  ) {}

  async execute(input: any): Promise<{ user: User, token: string }> {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValid = await this.hasher.compare(input.password, user.passwordHash);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    const token = this.tokenPort.sign({ userId: user.id });

    return { user, token };
  }
}
