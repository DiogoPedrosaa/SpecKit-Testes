import { IUserRepository } from '../ports/outbound/IUserRepository';
import { User } from '../../domain/User';

export class AddBalanceUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(input: { userId: string; amount: number }): Promise<User> {
    const user = await this.userRepository.findById(input.userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.addFreeBalance(input.amount);
    await this.userRepository.save(user);

    return user;
  }
}
