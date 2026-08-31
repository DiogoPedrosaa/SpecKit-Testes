# Tasks: Tibia Bazaar Clone

**Input**: Design documents from `/specs/001-tibia-bazaar-clone/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Fundações e inicialização.

- [x] T001 Initialize backend Node.js + TypeScript project in `backend/` with Fastify and Vitest
- [x] T002 [P] Initialize frontend React + TypeScript + Vite project in `frontend/` with Playwright
- [ ] T003 [P] Setup linting (ESLint, Prettier) in `backend/` and `frontend/`
- [ ] T004 Setup MongoDB connection structure and environment variables in `backend/src/shared/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure.

- [ ] T005 [P] Implement Logger service in `backend/src/shared/logger.ts`
- [ ] T006 [P] Implement API Error handler middleware in `backend/src/shared/errorHandler.ts`
- [ ] T007 [P] Implement Auth Middleware (JWT) stub in `backend/src/shared/authMiddleware.ts`
- [ ] T008 [P] Setup Base Repository interface in `backend/src/shared/baseRepository.ts`

---

## Phase 3: User Story 1 - Autenticação e Gestão de Conta (Priority: P1)

**Goal**: Permitir cadastro, login e gestão de saldo.

### Tests for User Story 1
- [ ] T009 [P] [US1] Create unit tests for User entity (balance management) in `backend/tests/unit/User.spec.ts`
- [ ] T010 [P] [US1] Create unit tests for User Registration Use Case in `backend/tests/unit/RegisterUserUseCase.spec.ts`
- [ ] T011 [P] [US1] Create unit tests for Add Balance Use Case in `backend/tests/unit/AddBalanceUseCase.spec.ts`
- [ ] T012 [P] [US1] Create integration test for Auth API in `backend/tests/integration/auth.test.ts`

### Implementation for User Story 1
- [ ] T013 [P] [US1] Create User Entity domain model in `backend/src/modules/users/domain/User.ts`
- [ ] T014 [US1] Implement RegisterUserUseCase and LoginUserUseCase in `backend/src/modules/users/application/authUseCases.ts`
- [ ] T015 [US1] Implement AddBalanceUseCase in `backend/src/modules/users/application/AddBalanceUseCase.ts`
- [ ] T016 [P] [US1] Create UserRepository MongoDB implementation in `backend/src/modules/users/infrastructure/MongoUserRepository.ts`
- [ ] T017 [US1] Create Auth and Account Fastify Controllers in `backend/src/modules/users/infrastructure/authController.ts`
- [ ] T018 [P] [US1] Implement Frontend Auth Service (API client) in `frontend/src/services/auth.ts`
- [ ] T019 [US1] Implement Frontend Login/Register pages and State in `frontend/src/pages/Auth/`

---

## Phase 4: User Story 2 - Cadastro e Listagem de Personagens (Priority: P1)

**Goal**: Cadastrar personagens na conta do usuário e listar anúncios ativos na home.

### Tests for User Story 2
- [ ] T020 [P] [US2] Create unit tests for Create Character Use Case in `backend/tests/unit/CreateCharacterUseCase.spec.ts`
- [ ] T021 [P] [US2] Create integration test for Characters API in `backend/tests/integration/characters.test.ts`

### Implementation for User Story 2
- [ ] T022 [P] [US2] Create Character Entity domain model in `backend/src/modules/characters/domain/Character.ts`
- [ ] T023 [US2] Implement CreateCharacterUseCase in `backend/src/modules/characters/application/CreateCharacterUseCase.ts`
- [ ] T024 [P] [US2] Create CharacterRepository MongoDB implementation in `backend/src/modules/characters/infrastructure/MongoCharacterRepository.ts`
- [ ] T025 [US2] Create Character Fastify Controller in `backend/src/modules/characters/infrastructure/characterController.ts`
- [ ] T026 [P] [US2] Implement Frontend Character Service (API client) in `frontend/src/services/characters.ts`
- [ ] T027 [US2] Implement Frontend My Characters page in `frontend/src/pages/MyCharacters/`

---

## Phase 5: User Story 3 - Criação e Encerramento de Anúncio (Priority: P2)

**Goal**: Vendedor pode criar leilão e o sistema encerra automaticamente.

### Tests for User Story 3
- [ ] T028 [P] [US3] Create unit tests for Auction Entity (create and finish rules) in `backend/tests/unit/Auction.spec.ts`
- [ ] T029 [P] [US3] Create unit tests for Create Auction Use Case in `backend/tests/unit/CreateAuctionUseCase.spec.ts`
- [ ] T030 [P] [US3] Create unit tests for Finish Auction Use Case in `backend/tests/unit/FinishAuctionUseCase.spec.ts`

### Implementation for User Story 3
- [ ] T031 [P] [US3] Create Auction Entity domain model in `backend/src/modules/auctions/domain/Auction.ts`
- [ ] T032 [US3] Implement CreateAuctionUseCase in `backend/src/modules/auctions/application/CreateAuctionUseCase.ts`
- [ ] T033 [US3] Implement FinishAuctionUseCase in `backend/src/modules/auctions/application/FinishAuctionUseCase.ts`
- [ ] T034 [P] [US3] Create AuctionRepository MongoDB implementation in `backend/src/modules/auctions/infrastructure/MongoAuctionRepository.ts`
- [ ] T035 [US3] Create Auction Fastify Controller in `backend/src/modules/auctions/infrastructure/auctionController.ts`
- [ ] T036 [US3] Implement Cron Job for processing finished auctions in `backend/src/modules/auctions/infrastructure/auctionCron.ts`
- [ ] T037 [US3] Implement Frontend Create Auction Modal/Page in `frontend/src/pages/MyCharacters/CreateAuction.tsx`

---

## Phase 6: User Story 4 - Sistema de Lances e Débito (Priority: P2)

**Goal**: Comprador pode dar lances; saldos são retidos, devolvidos (overbid) e transferidos no encerramento (com taxas).

### Tests for User Story 4
- [ ] T038 [P] [US4] Create unit tests for Bid Entity and Auction PlaceBid rule in `backend/tests/unit/BidRules.spec.ts`
- [ ] T039 [P] [US4] Create unit tests for Place Bid Use Case in `backend/tests/unit/PlaceBidUseCase.spec.ts`
- [ ] T040 [P] [US4] Create integration test for Bidding API with concurrent requests in `backend/tests/integration/bidding.test.ts`

### Implementation for User Story 4
- [ ] T041 [P] [US4] Create Bid Entity domain model in `backend/src/modules/auctions/domain/Bid.ts`
- [ ] T042 [US4] Implement PlaceBidUseCase in `backend/src/modules/auctions/application/PlaceBidUseCase.ts`
- [ ] T043 [US4] Update FinishAuctionUseCase to handle fees (50 TC fixed + 12% fee) and balance transfers in `backend/src/modules/auctions/application/FinishAuctionUseCase.ts`
- [ ] T044 [P] [US4] Create BidRepository MongoDB implementation in `backend/src/modules/auctions/infrastructure/MongoBidRepository.ts`
- [ ] T045 [US4] Create Bid Fastify Controller in `backend/src/modules/auctions/infrastructure/bidController.ts`
- [ ] T046 [US4] Implement Frontend Bidding interface in `frontend/src/pages/AuctionDetails/`

---

## Phase 7: User Story 5 - Histórico e Visualização Detalhada (Priority: P3)

**Goal**: Ver detalhes do leilão e histórico de participação.

### Tests for User Story 5
- [ ] T047 [P] [US5] Create E2E test for the full auction lifecycle (login, create, bid, finish, view history) in `frontend/tests/e2e/auctionLifecycle.spec.ts`

### Implementation for User Story 5
- [ ] T048 [P] [US5] Create ViewAuctionHistoryUseCase in `backend/src/modules/auctions/application/ViewAuctionHistoryUseCase.ts`
- [ ] T049 [US5] Add History endpoints to controllers in `backend/src/modules/auctions/infrastructure/auctionController.ts`
- [ ] T050 [US5] Implement Frontend User History Page in `frontend/src/pages/MyHistory/`
- [ ] T051 [US5] Implement Frontend Home Page (List Active Auctions) mimicking Tibia.com visual style in `frontend/src/pages/Home/`

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Melhorias que afetam múltiplas user stories.

- [ ] T052 [P] Code cleanup and refactoring
- [ ] T053 Run quickstart.md validation to ensure the MVP works end-to-end
