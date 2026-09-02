# Tasks: Tibia Bazaar Clone

**Input**: Design documents from `/specs/001-tibia-bazaar-clone/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Fundações e inicialização.

- [x] T001 Initialize backend Node.js + TypeScript project in `backend/` with Fastify, Vitest and TypeScript configuration
- [x] T002 [P] Initialize frontend React + TypeScript + Vite project in `frontend/` with Playwright
- [x] T003 [P] Setup linting (ESLint, Prettier) in `backend/` and `frontend/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure and Hexagonal Architecture validation.

- [x] T004 Setup MongoDB connection structure and environment variables in `backend/src/main/database/mongoSetup.ts`
- [x] T005 [P] Implement API Error handler in `backend/src/shared/errorHandler.ts`
- [x] T006 [P] Create architecture validation test to ensure `domain` and `application` do not import `adapters` or `main` (dependency rule) in `backend/tests/architecture/hexagonal.test.ts`

---

## Phase 3: User Story 1 - Autenticação e Gestão de Conta (Priority: P1) 🎯 MVP

**Goal**: Permitir cadastro, login e gestão de saldo.

**Independent Test**: Pode ser testado registrando um usuário, fazendo login e visualizando a interface da conta.

### Tests for User Story 1 (TDD required) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T007 [P] [US1] Create unit tests for User entity (balance management) in `backend/tests/unit/domain/User.spec.ts`
- [x] T008 [P] [US1] Create unit tests for Auth Use Cases in `backend/tests/unit/application/AuthUseCases.spec.ts`
- [x] T009 [P] [US1] Create integration test for Auth API in `backend/tests/integration/auth.test.ts`

### Implementation for User Story 1

- [x] T010 [P] [US1] Create User Entity (Domain) in `backend/src/modules/users/domain/User.ts`
- [x] T011 [P] [US1] Define Outbound Ports (IUserRepository, IHasherPort, ITokenPort) in `backend/src/modules/users/application/ports/outbound/`
- [x] T012 [US1] Implement Auth Use Cases (Application) in `backend/src/modules/users/application/use-cases/`
- [x] T013 [P] [US1] Create MongoUserRepository (Outbound Adapter) in `backend/src/modules/users/adapters/outbound/MongoUserRepository.ts`
- [x] T014 [P] [US1] Create Bcrypt & JWT Outbound Adapters in `backend/src/modules/users/adapters/outbound/`
- [x] T015 [US1] Create AuthController HTTP (Inbound Adapter) in `backend/src/modules/users/adapters/inbound/authController.ts`
- [x] T016 [US1] Configure wiring in `backend/src/main/factories/authFactory.ts`
- [x] T017 [P] [US1] Implement Frontend Auth Service & UI in `frontend/src/`

**Checkpoint**: User Registration, Login, and Balance Management fully functional and independently tested.

---

## Phase 4: User Story 2 - Cadastro e Listagem de Personagens (Priority: P1)

**Goal**: Cadastrar personagens na conta do usuário e listar anúncios ativos na home.

**Independent Test**: Pode ser testado cadastrando personagens via painel do usuário e acessando a listagem pública.

### Tests for User Story 2 (TDD required) ⚠️

- [x] T018 [P] [US2] Create unit tests for Character Use Cases in `backend/tests/unit/application/CharacterUseCases.spec.ts`
- [x] T019 [P] [US2] Create integration test for Characters API in `backend/tests/integration/characters.test.ts`

### Implementation for User Story 2

- [x] T020 [P] [US2] Create Character Entity (Domain) in `backend/src/modules/characters/domain/Character.ts`
- [x] T021 [P] [US2] Define Outbound Ports (ICharacterRepository) in `backend/src/modules/characters/application/ports/outbound/ICharacterRepository.ts`
- [x] T022 [US2] Implement Character Use Cases (Application) in `backend/src/modules/characters/application/use-cases/`
- [x] T023 [P] [US2] Create MongoCharacterRepository (Outbound Adapter) in `backend/src/modules/characters/adapters/outbound/MongoCharacterRepository.ts`
- [x] T024 [US2] Create CharacterController HTTP (Inbound Adapter) in `backend/src/modules/characters/adapters/inbound/characterController.ts`
- [x] T025 [US2] Configure wiring in `backend/src/main/factories/characterFactory.ts`
- [x] T026 [P] [US2] Implement Frontend Character UI in `frontend/src/`

**Checkpoint**: Characters can be created and listed independently.

---

## Phase 5: User Story 3 - Criação e Encerramento de Anúncio (Priority: P2)

**Goal**: Vendedor pode criar leilão e o sistema encerra automaticamente.

**Independent Test**: Pode ser testado criando o anúncio, avançando o tempo do sistema e checando se o status mudou para finalizado.

### Tests for User Story 3 (TDD required) ⚠️

- [x] T027 [P] [US3] Create unit tests for Auction Entity in `backend/tests/unit/domain/Auction.spec.ts`
- [x] T028 [P] [US3] Create unit tests for Create/Finish Auction Use Cases in `backend/tests/unit/application/AuctionUseCases.spec.ts`
- [x] T029 [P] [US3] Create integration test for Auctions API in `backend/tests/integration/auctions.test.ts`

### Implementation for User Story 3

- [x] T030 [P] [US3] Create Auction Entity (Domain) in `backend/src/modules/auctions/domain/Auction.ts`
- [x] T031 [P] [US3] Define Outbound Ports (IAuctionRepository) in `backend/src/modules/auctions/application/ports/outbound/IAuctionRepository.ts`
- [x] T032 [US3] Implement Auction Use Cases (Application) in `backend/src/modules/auctions/application/use-cases/`
- [x] T033 [P] [US3] Create MongoAuctionRepository (Outbound Adapter) in `backend/src/modules/auctions/adapters/outbound/MongoAuctionRepository.ts`
- [x] T034 [US3] Create AuctionController HTTP (Inbound Adapter) in `backend/src/modules/auctions/adapters/inbound/auctionController.ts`
- [x] T035 [US3] Create AuctionCron Background Job (Inbound Adapter) in `backend/src/modules/auctions/adapters/inbound/auctionCron.ts`
- [x] T036 [US3] Configure wiring in `backend/src/main/factories/auctionFactory.ts`
- [x] T037 [P] [US3] Implement Frontend Auction UI in `frontend/src/`

**Checkpoint**: Auctions can be created and finish over time.

---

## Phase 6: User Story 4 - Sistema de Lances e Débito (Priority: P2)

**Goal**: Comprador pode dar lances; saldos são retidos e transferidos no encerramento.

**Independent Test**: Testado dando um lance em leilão, checando validação de saldo e histórico de lances.

### Tests for User Story 4 (TDD required) ⚠️

- [x] T038 [P] [US4] Create unit tests for Bid rules in `backend/tests/unit/domain/BidRules.spec.ts`
- [x] T039 [P] [US4] Create unit tests for PlaceBid Use Case in `backend/tests/unit/application/PlaceBidUseCase.spec.ts`
- [x] T040 [P] [US4] Create integration test for Bidding API with concurrent requests in `backend/tests/integration/bidding.test.ts`

### Implementation for User Story 4

- [x] T041 [P] [US4] Update Auction Entity to handle Bids (Domain) in `backend/src/modules/auctions/domain/Auction.ts`
- [x] T042 [US4] Implement PlaceBidUseCase (Application) in `backend/src/modules/auctions/application/use-cases/PlaceBidUseCase.ts`
- [x] T043 [US4] Update MongoAuctionRepository (Outbound Adapter) to store bids in `backend/src/modules/auctions/adapters/outbound/MongoAuctionRepository.ts`
- [x] T044 [US4] Add PlaceBid HTTP endpoint in AuctionController (Inbound Adapter) in `backend/src/modules/auctions/adapters/inbound/auctionController.ts`
- [x] T045 [P] [US4] Implement Frontend Bidding UI in `frontend/src/`

**Checkpoint**: Users can bid on active auctions, with balances correctly updated.

---

## Phase 7: User Story 5 - Histórico e Visualização Detalhada (Priority: P3)

**Goal**: Detalhes completos de anúncio e histórico de participação do usuário.

**Independent Test**: Testado acessando painel de histórico após lances e vendas.

### Tests for User Story 5 (TDD required) ⚠️

- [x] T046 [P] [US5] Create unit tests for History Use Cases in `backend/tests/unit/application/HistoryUseCases.spec.ts`
- [x] T047 [P] [US5] Create integration test for History API in `backend/tests/integration/history.test.ts`

### Implementation for User Story 5

- [x] T048 [US5] Implement History Use Cases (Application) in `backend/src/modules/auctions/application/use-cases/`
- [x] T049 [US5] Update AuctionController (Inbound Adapter) for History endpoints in `backend/src/modules/auctions/adapters/inbound/auctionController.ts`
- [x] T050 [P] [US5] Implement Frontend History UI in `frontend/src/`

---

## Final Phase: Polish & Cross-Cutting Concerns

- [x] T051 [P] E2E Playwright test covering the full Happy Path (Validation Guide) in `frontend/tests/e2e/happypath.spec.ts`
- [x] T052 Refactor duplicate code in adapters if necessary

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Setup. Blocks user stories.
- **User Stories (Phase 3+)**: Depend on Foundational phase.
  - US1 (Auth) and US2 (Characters) can proceed in parallel.
  - US3 (Auctions) depends on US2 (Characters) and partially on US1 (Sellers).
  - US4 (Bidding) depends on US1 (Auth/Balance) and US3 (Auctions).
  - US5 (History) depends on US4.

### Parallel Opportunities

- Tests within a User Story can run in parallel.
- Outbound Adapters (MongoDB, Bcrypt) can be implemented in parallel with Frontend Service layers.
- Inbound Adapters (Fastify) must wait for Application Use Cases.
