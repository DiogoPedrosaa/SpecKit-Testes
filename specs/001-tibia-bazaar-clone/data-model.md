# Data Model & Domain Entities

## 1. User
**Regras**: SaldoLivre + SaldoRetido = SaldoTotal. Saldo livre não pode ser negativo.
```typescript
class User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  freeBalance: number; // Tibia Coins disponíveis
  lockedBalance: number; // Tibia Coins retidas em lances

  reserveBalance(amount: number): void {
    if (this.freeBalance < amount) throw new InsufficientBalanceError();
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

  addFreeBalance(amount: number): void {
    this.freeBalance += amount;
  }
}
```

## 2. Character
**Regras**: Um personagem só pode estar em um leilão ativo por vez.
```typescript
class Character {
  id: string;
  name: string;
  level: number;
  vocation: 'Knight' | 'Paladin' | 'Sorcerer' | 'Druid' | 'Monk'; 
  ownerId: string;
}
```

## 3. Auction (Anúncio)
**Regras**: Não aceita lances menores que o lance atual + incremento, ou menor que o preço mínimo se for o primeiro lance. Leilão encerra sem anti-snipe.
```typescript
class Auction {
  id: string;
  characterId: string;
  sellerId: string;
  startPrice: number;
  highestBidAmount: number;
  highestBidderId: string | null;
  endTime: Date;
  status: 'ACTIVE' | 'FINISHED_SOLD' | 'FINISHED_NO_BIDS' | 'CANCELLED';

  placeBid(bidderId: string, amount: number, now: Date): Bid {
    if (now >= this.endTime) throw new AuctionEndedError();
    if (this.status !== 'ACTIVE') throw new InvalidAuctionStateError();
    if (amount <= this.highestBidAmount) throw new BidTooLowError();
    if (this.highestBidderId === null && amount < this.startPrice) throw new BidTooLowError();
    
    // Regra da taxa não se aplica a quem dá o lance, mas a quem vende (retém 12% no fim).
    return new Bid(this.id, bidderId, amount, now);
  }

  finish(now: Date): void {
    if (now < this.endTime) throw new AuctionNotEndedError();
    this.status = this.highestBidderId ? 'FINISHED_SOLD' : 'FINISHED_NO_BIDS';
  }
}
```

## 4. Bid (Lance)
```typescript
class Bid {
  id: string;
  auctionId: string;
  bidderId: string;
  amount: number;
  createdAt: Date;
}
```
