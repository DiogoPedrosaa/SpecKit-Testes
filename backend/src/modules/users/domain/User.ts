export class InsufficientBalanceError extends Error {
  constructor() {
    super('Insufficient balance');
    this.name = 'InsufficientBalanceError';
  }
}

export class User {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public passwordHash: string,
    public freeBalance: number = 0,
    public lockedBalance: number = 0
  ) {}

  addFreeBalance(amount: number): void {
    this.freeBalance += amount;
  }

  reserveBalance(amount: number): void {
    if (this.freeBalance < amount) {
      throw new InsufficientBalanceError();
    }
    this.freeBalance -= amount;
    this.lockedBalance += amount;
  }

  releaseBalance(amount: number): void {
    this.lockedBalance -= amount;
    this.freeBalance += amount;
  }

  deductLockedBalance(amount: number): void {
    this.lockedBalance -= amount;
  }
}
