# API Contracts

## Autenticação
- `POST /api/auth/register`
  - Body: `{ name, email, password }`
  - Response 201: `{ token, user: { id, name, freeBalance } }`
- `POST /api/auth/login`
  - Body: `{ email, password }`
  - Response 200: `{ token }`

## Conta (Requer Autenticação)
- `GET /api/account/me`
  - Response 200: `{ id, name, freeBalance, lockedBalance }`
- `POST /api/account/add-balance` (Mock para o MVP)
  - Body: `{ amount }`
  - Response 200: `{ freeBalance }`

## Personagens (Requer Autenticação)
- `POST /api/characters`
  - Body: `{ name, level, vocation }`
  - Response 201: `{ id, name, level, vocation }`
- `GET /api/characters/me`
  - Response 200: `[{ id, name, level, vocation, activeAuctionId }]`

## Leilões / Anúncios
- `GET /api/auctions` (Público)
  - Query: `?page=1&limit=10`
  - Response 200: `{ items: [...], total }`
- `GET /api/auctions/:id` (Público)
  - Response 200: `{ id, character: {...}, startPrice, highestBidAmount, endTime, status, bids: [{ amount, createdAt }] }` // Bids são anônimos
- `POST /api/auctions` (Requer Autenticação)
  - Body: `{ characterId, startPrice, endTime }`
  - Response 201: `{ id, status }`
- `POST /api/auctions/:id/bids` (Requer Autenticação)
  - Body: `{ amount }`
  - Response 201: `{ id, highestBidAmount }`

## Webhooks/Jobs Internos
- `POST /api/internal/process-auctions` (Ou disparado por cron)
  - Response 200: `{ processed: number }`
