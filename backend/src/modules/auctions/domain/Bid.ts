export class Bid {
  constructor(
    public readonly id: string,
    public readonly auctionId: string,
    public readonly bidderId: string,
    public readonly amount: number,
    public readonly createdAt: Date
  ) {}
}
